/**
 * Discriminated union of every analytics event we emit. Adding an event here is the
 * trigger for instrumentation — never call analytics.track with an ad-hoc shape.
 */

export type AnalyticsEvent =
  | { name: 'cta_click'; properties: { location: string; label: string; href?: string } }
  | { name: 'form_submit'; properties: { form: string; ok: boolean } }
  | { name: 'video_play'; properties: { src: string; position?: number } }
  | { name: 'experiment_view'; properties: { key: string; variant: string } };
