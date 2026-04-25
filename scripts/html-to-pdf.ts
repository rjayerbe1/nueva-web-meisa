/**
 * Convierte un HTML a PDF usando puppeteer + Chrome local.
 * Uso: npx tsx scripts/html-to-pdf.ts <input.html> <output.pdf>
 */
import puppeteer from "puppeteer"

async function main() {
  const input = process.argv[2]
  const output = process.argv[3]
  if (!input || !output) {
    console.error("Uso: npx tsx scripts/html-to-pdf.ts <input.html> <output.pdf>")
    process.exit(1)
  }
  const inputUrl = input.startsWith("/") ? `file://${input}` : input

  console.log(`📄 ${inputUrl} → ${output}`)
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", `--user-data-dir=/tmp/chrome-pdf-${Date.now()}`],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1240, height: 1754 })

  await page.goto(inputUrl, { waitUntil: "domcontentloaded", timeout: 60000 })
  // Esperar imágenes externas
  await new Promise((r) => setTimeout(r, 25000))

  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  })
  await browser.close()
  console.log(`✅ ${output}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
