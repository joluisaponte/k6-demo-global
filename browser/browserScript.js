import { browser } from 'k6/browser';
import { AddRemove } from './pages/addRemovePage.js';
import { sleep } from 'k6'



export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 1,
      iterations: 1,
      maxDuration: '2m'
    },
  },
}

export default async function () {
  const context = browser.newContext({})
  const page = context.newPage()

  try {
    const addRemovePage = new AddRemove(page)
    await addRemovePage.goto()
    await addRemovePage.submitForm(__ENV.TEST_USERNAME_2, __ENV.TEST_PASSWORD_2)
    sleep(1)
    await addRemovePage.addElement()
  } finally {
    page.close()
    context.close()
  }
}