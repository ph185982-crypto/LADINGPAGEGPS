import { NextRequest, NextResponse } from "next/server";

const TOKEN =
  process.env.META_CAPI_ACCESS_TOKEN ??
  "EAAbrIQFXM0oBRpBOxdZCeYSwXhdZBATJvqLMesb5ZBsTiaDobe0YZCOlZBFBdqJl4fgmlZC6Kv7LYkxOdDUx8sFC9kalcXqPtn9ncechX1sywY2rcZCks3DtXOKHBGsgzbGJPWugkuBr5F9Ltl9RYmcagANl02ZCqUe7KhhtZBn6gKWiH33em3fe48UzAQp6N9wZDZD";

const AD_ACCOUNT = "act_731029812189500";
const BASE = "https://graph.facebook.com/v19.0";

const INSIGHT_FIELDS = [
  "impressions",
  "clicks",
  "ctr",
  "cpm",
  "cpc",
  "spend",
  "reach",
  "frequency",
  "actions",
  "cost_per_action_type",
  "unique_clicks",
  "unique_ctr",
].join(",");

async function metaGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  return res.json();
}

function extractAction(actions: { action_type: string; value: string }[] | undefined, type: string) {
  return parseFloat(actions?.find((a) => a.action_type === type)?.value ?? "0");
}

function normalizeInsights(raw: Record<string, unknown>) {
  const actions = raw.actions as { action_type: string; value: string }[] | undefined;
  const cpa = raw.cost_per_action_type as { action_type: string; value: string }[] | undefined;
  return {
    impressions:      parseInt((raw.impressions as string) ?? "0"),
    clicks:           parseInt((raw.clicks as string) ?? "0"),
    spend:            parseFloat((raw.spend as string) ?? "0"),
    reach:            parseInt((raw.reach as string) ?? "0"),
    ctr:              parseFloat((raw.ctr as string) ?? "0"),
    cpm:              parseFloat((raw.cpm as string) ?? "0"),
    cpc:              parseFloat((raw.cpc as string) ?? "0"),
    frequency:        parseFloat((raw.frequency as string) ?? "0"),
    uniqueClicks:     parseInt((raw.unique_clicks as string) ?? "0"),
    uniqueCtr:        parseFloat((raw.unique_ctr as string) ?? "0"),
    viewContent:      extractAction(actions, "offsite_conversion.fb_pixel_view_content"),
    initiateCheckout: extractAction(actions, "offsite_conversion.fb_pixel_initiate_checkout"),
    purchase:         extractAction(actions, "offsite_conversion.fb_pixel_purchase"),
    costPerCheckout:  parseFloat(cpa?.find((a) => a.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value ?? "0"),
    costPerPurchase:  parseFloat(cpa?.find((a) => a.action_type === "offsite_conversion.fb_pixel_purchase")?.value ?? "0"),
  };
}

const EMPTY_INSIGHTS = normalizeInsights({});

export async function GET(req: NextRequest) {
  const datePreset = req.nextUrl.searchParams.get("date_preset") ?? "today";

  try {
    // 1. Account summary + daily breakdown
    const [accountInsights, dailyInsights, campaignsRaw, adsetsRaw, adsRaw] = await Promise.all([
      metaGet(`${AD_ACCOUNT}/insights`, { fields: INSIGHT_FIELDS, date_preset: datePreset }),
      metaGet(`${AD_ACCOUNT}/insights`, {
        fields: "impressions,clicks,spend,ctr",
        date_preset: "last_7d",
        time_increment: "1",
      }),
      metaGet(`${AD_ACCOUNT}/campaigns`, {
        fields: `id,name,status,effective_status,objective,daily_budget`,
        limit: "20",
      }),
      metaGet(`${AD_ACCOUNT}/adsets`, {
        fields: `id,name,status,effective_status,daily_budget,optimization_goal,campaign_id`,
        limit: "50",
      }),
      metaGet(`${AD_ACCOUNT}/ads`, {
        fields: `id,name,status,effective_status,adset_id,campaign_id,creative{thumbnail_url,object_type}`,
        limit: "50",
      }),
    ]);

    const campaigns = campaignsRaw.data ?? [];
    const adsets = adsetsRaw.data ?? [];
    const ads = adsRaw.data ?? [];

    // 2. Fetch insights for each campaign, adset, ad in parallel
    const [campInsights, adsetInsights, adInsights] = await Promise.all([
      Promise.all(
        campaigns.map((c: { id: string }) =>
          metaGet(`${c.id}/insights`, { fields: INSIGHT_FIELDS, date_preset: datePreset })
            .then((d) => ({ id: c.id, insights: normalizeInsights(d.data?.[0] ?? {}) }))
        )
      ),
      Promise.all(
        adsets.map((s: { id: string }) =>
          metaGet(`${s.id}/insights`, { fields: INSIGHT_FIELDS, date_preset: datePreset })
            .then((d) => ({ id: s.id, insights: normalizeInsights(d.data?.[0] ?? {}) }))
        )
      ),
      Promise.all(
        ads.map((a: { id: string }) =>
          metaGet(`${a.id}/insights`, { fields: INSIGHT_FIELDS, date_preset: datePreset })
            .then((d) => ({ id: a.id, insights: normalizeInsights(d.data?.[0] ?? {}) }))
        )
      ),
    ]);

    const campMap = Object.fromEntries(campInsights.map((c) => [c.id, c.insights]));
    const adsetMap = Object.fromEntries(adsetInsights.map((s) => [s.id, s.insights]));
    const adMap = Object.fromEntries(adInsights.map((a) => [a.id, a.insights]));

    const accountSummary = normalizeInsights(accountInsights.data?.[0] ?? {});
    const dailyData = (dailyInsights.data ?? []).map((d: Record<string, string>) => ({
      date: d.date_start,
      impressions: parseInt(d.impressions ?? "0"),
      clicks: parseInt(d.clicks ?? "0"),
      spend: parseFloat(d.spend ?? "0"),
      ctr: parseFloat(d.ctr ?? "0"),
    }));

    const campaignsOut = campaigns.map((c: Record<string, unknown>) => ({
      id: c.id,
      name: c.name,
      status: c.effective_status,
      objective: c.objective,
      dailyBudget: parseInt((c.daily_budget as string) ?? "0") / 100,
      insights: campMap[c.id as string] ?? EMPTY_INSIGHTS,
    }));

    const adsetsOut = adsets.map((s: Record<string, unknown>) => ({
      id: s.id,
      name: s.name,
      status: s.effective_status,
      campaignId: s.campaign_id,
      dailyBudget: parseInt((s.daily_budget as string) ?? "0") / 100,
      optimizationGoal: s.optimization_goal,
      insights: adsetMap[s.id as string] ?? EMPTY_INSIGHTS,
    }));

    const adsOut = ads.map((a: Record<string, unknown>) => ({
      id: a.id,
      name: a.name,
      status: a.effective_status,
      adsetId: a.adset_id,
      campaignId: a.campaign_id,
      thumbnail: (a.creative as Record<string, unknown>)?.thumbnail_url ?? null,
      objectType: (a.creative as Record<string, unknown>)?.object_type ?? "LINK",
      insights: adMap[a.id as string] ?? EMPTY_INSIGHTS,
    }));

    return NextResponse.json({
      account: accountSummary,
      dailyData,
      campaigns: campaignsOut,
      adsets: adsetsOut,
      ads: adsOut,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
