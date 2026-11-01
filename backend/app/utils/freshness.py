from datetime import datetime, timedelta, timezone


def freshness_for(timestamp, freshness_days, now=None):
    if not timestamp:
        return 'Needs confirmation'
    if now is None:
        now = datetime.now(timezone.utc)
    age = now - timestamp
    return 'Current' if age <= timedelta(days=freshness_days) else 'Needs confirmation'


def stock_freshness(timestamp, freshness_hours, now=None):
    if not timestamp:
        return 'Needs confirmation'
    if now is None:
        now = datetime.now(timezone.utc)
    age = now - timestamp
    return 'Current' if age <= timedelta(hours=freshness_hours) else 'Needs confirmation'
