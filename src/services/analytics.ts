// Simple Analytics Service
// In production, you would integrate with Google Analytics, Mixpanel, etc.

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    // Check if analytics should be enabled (respect user privacy)
    this.isEnabled = this.shouldEnableAnalytics();
  }

  private shouldEnableAnalytics(): boolean {
    // Check localStorage for user preference
    const consent = localStorage.getItem('analytics-consent');
    return consent === 'true';
  }

  public setConsent(consent: boolean): void {
    localStorage.setItem('analytics-consent', consent.toString());
    this.isEnabled = consent;
  }

  public track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      action: eventName,
      category: properties?.category || 'general',
      label: properties?.label,
      value: properties?.value,
      userId: properties?.userId,
      timestamp: Date.now()
    };

    this.events.push(event);
    console.log('Analytics Event:', event);

    // In production, send to analytics service
    this.sendToAnalyticsService(event);
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Simulate sending to analytics service
    // In production, replace with actual analytics SDK calls
    
    // Example for Google Analytics 4:
    // gtag('event', event.action, {
    //   event_category: event.category,
    //   event_label: event.label,
    //   value: event.value
    // });

    // Example for Mixpanel:
    // mixpanel.track(event.action, {
    //   category: event.category,
    //   label: event.label,
    //   value: event.value
    // });
  }

  // Predefined tracking methods for common events
  public trackPageView(pageName: string, userId?: string): void {
    this.track('page_view', {
      category: 'navigation',
      label: pageName,
      userId
    });
  }

  public trackDiveEntryCreated(entryId: string, userId?: string): void {
    this.track('dive_entry_created', {
      category: 'dive_entry',
      label: entryId,
      userId
    });
  }

  public trackDiveEntryUpdated(entryId: string, userId?: string): void {
    this.track('dive_entry_updated', {
      category: 'dive_entry',
      label: entryId,
      userId
    });
  }

  public trackDiveEntryDeleted(entryId: string, userId?: string): void {
    this.track('dive_entry_deleted', {
      category: 'dive_entry',
      label: entryId,
      userId
    });
  }

  public trackSearch(query: string, resultsCount: number, userId?: string): void {
    this.track('search', {
      category: 'search',
      label: query,
      value: resultsCount,
      userId
    });
  }

  public trackFilterUsed(filterType: string, filterValue: string, userId?: string): void {
    this.track('filter_used', {
      category: 'filter',
      label: `${filterType}:${filterValue}`,
      userId
    });
  }

  public trackAuthMethod(method: 'google' | 'anonymous', userId?: string): void {
    this.track('auth_method', {
      category: 'authentication',
      label: method,
      userId
    });
  }

  public trackError(error: string, context: string, userId?: string): void {
    this.track('error', {
      category: 'error',
      label: `${context}:${error}`,
      userId
    });
  }

  public trackPerformance(metric: string, value: number, userId?: string): void {
    this.track('performance', {
      category: 'performance',
      label: metric,
      value,
      userId
    });
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public exportData(): string {
    return JSON.stringify({
      events: this.events,
      totalEvents: this.events.length,
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
export default analytics;
