import { api } from './api.js';
import { BLOOD_GROUPS } from './enums.js';
import { element, setMessage } from './view-utils.js';

const grid = document.querySelector('#blood-group-availability');
const message = document.querySelector('#availability-message');

async function loadAvailability() {
  grid.setAttribute('aria-busy', 'true');
  const results = await Promise.allSettled(
    BLOOD_GROUPS.map(async (bloodGroup) => {
      const { data } = await api.search.bloodBanks({ blood_group: bloodGroup });
      const items = Array.isArray(data.items) ? data.items : [];
      return {
        bloodGroup,
        banks: items.length,
        units: items.reduce((total, item) => total + (Number(item.units_reported) || 0), 0),
      };
    }),
  );

  const successful = results.filter((result) => result.status === 'fulfilled');
  grid.replaceChildren();
  for (const result of successful) {
    const { bloodGroup, banks, units } = result.value;
    const card = element('article', 'blood-group-card');
    card.append(element('strong', '', bloodGroup));
    card.append(element('span', '', `${units} reported units`));
    card.append(element('span', 'muted', `${banks} verified ${banks === 1 ? 'bank' : 'banks'}`));
    grid.append(card);
  }
  grid.setAttribute('aria-busy', 'false');

  const failed = results.length - successful.length;
  if (failed === results.length) {
    setMessage(message, 'Live availability could not be loaded. Check that the backend is running and try the search page again.', 'error');
  } else if (failed) {
    setMessage(message, `Availability loaded for ${successful.length} of ${results.length} blood groups; some backend searches failed.`, 'warning');
  } else {
    setMessage(message, 'Totals are based on verified blood-bank inventory returned by the backend.', '');
  }
}

loadAvailability().catch((error) => {
  grid.replaceChildren();
  grid.setAttribute('aria-busy', 'false');
  setMessage(message, error.message || 'Live availability could not be loaded.', 'error');
});
