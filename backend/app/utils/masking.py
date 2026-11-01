def mask_phone(value):
    if not value:
        return value
    digits = ''.join(ch for ch in value if ch.isdigit())
    if len(digits) <= 4:
        return digits
    return f'{digits[:2]}******{digits[-2:]}'


def display_name(full_name):
    if not full_name:
        return ''
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0]
    return f'{parts[0]} {parts[-1][0]}.'
