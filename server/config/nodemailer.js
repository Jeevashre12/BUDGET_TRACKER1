import nodemailer from "nodemailer"

const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com"
const smtpPort = Number(process.env.SMTP_PORT || 587)
const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true"
const hasAuth = !!(process.env.SMTP_USER && process.env.SMTP_PASS)

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: hasAuth
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
})

// Only verify when credentials are configured to avoid noisy startup errors in dev
if (hasAuth) {
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP ERROR:", err)
    } else {
      console.log(
        `SMTP connected (host=${smtpHost}, port=${smtpPort}, secure=${smtpSecure}).`
      )
    }
  })
} else {
  console.log(
    "SMTP disabled (no credentials). Set SMTP_USER, SMTP_PASS, SENDER_EMAIL to enable."
  )
}

export default transporter
