import { browser } from "k6/browser"
import { check, sleep} from "k6"
import { MainPage } from "./pages/main-page.js"
import { AbTestPage } from "./pages/ab-test-page.js"


export const options = {
  thresholds: {
    checks: [
      "rate >= 1"
    ]
  },
  scenarios: {
    FunctionalTesting: {
      executor: 'shared-iterations',
      exec: 'roundRobinScript',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 1,
      iterations: 1,
      maxDuration: '2m',
    },
  }
}

export async function roundRobinScript() {

  // Start Browser
  const context = browser.newContext({})
  const page = context.newPage()

  // Login and validate log in
  const mainPage = new MainPage(page)
  await mainPage.goto()
  sleep(2)
  await mainPage.submitForm(__ENV.TEST_USERNAME_2, __ENV.TEST_PASSWORD_2)
  sleep(1)

  // go to AB testing page
  const abTestPage = new AbTestPage(page)
  await abTestPage.goto()
  sleep(4)
  await abTestPage.validateAbTestPage()

  page.close()
}
