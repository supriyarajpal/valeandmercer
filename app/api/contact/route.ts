import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const TO = [process.env.CONTACT_EMAIL || 'rghvrjpl@gmail.com']
const FROM = 'Vale and Mercer <onboarding@resend.dev>'

const CELL_LABEL = 'padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px;width:160px'
const CELL_VALUE = 'padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px'
const CELL_LABEL_LAST = 'padding:10px 0;color:#9A9188;font-size:12px;vertical-align:top'
const CELL_VALUE_LAST = 'padding:10px 0;color:#28231C;font-size:14px;line-height:1.8'

function row(label: string, value: string, last = false) {
  const lstyle = last ? CELL_LABEL_LAST : CELL_LABEL
  const vstyle = last ? CELL_VALUE_LAST : CELL_VALUE
  return `<tr><td style="${lstyle}">${label}</td><td style="${vstyle}">${value || '-'}</td></tr>`
}

function shell(heading: string, rows: string) {
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#EFECE6"><h2 style="font-size:24px;font-weight:300;color:#28231C;border-bottom:1px solid #DDD7CC;padding-bottom:16px;margin-bottom:24px">${heading}</h2><table style="width:100%;border-collapse:collapse">${rows}</table><p style="margin-top:32px;font-size:11px;color:#9A9188">Sent from valeandmercer.co.uk</p></div>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, interest, subject, consent } = body as Record<string, string | boolean | undefined>
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown'
    const consentLabel = consent === true ? 'Yes (given at submission)' : 'No'

    // Property Alert Registration (from /register) carries `phone` + `budget`
    // and a custom subject. Homepage contact form carries `message` instead.
    const isRegistration = subject === 'Property Alert Registration'

    let html: string
    let mailSubject: string

    if (isRegistration) {
      const { phone, budget } = body as Record<string, string | undefined>
      const rows = [
        row('Name', fullName),
        row('Email', (email as string) || ''),
        row('Phone', phone || ''),
        row('Looking for', (interest as string) || ''),
        row('Budget', budget || ''),
        row('Consent given', consentLabel, true),
      ].join('')
      html = shell('Vale & Mercer: Property Alert Registration', rows)
      mailSubject = 'Property Alert Registration: ' + fullName
    } else {
      const { message } = body as Record<string, string | undefined>
      const rows = [
        row('Name', fullName),
        row('Email', (email as string) || ''),
        row('Interested In', (interest as string) || ''),
        row('Message', message || ''),
        row('Consent given', consentLabel, true),
      ].join('')
      html = shell('Vale & Mercer: New Enquiry', rows)
      mailSubject = 'New enquiry: ' + fullName
    }

    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: mailSubject,
      html: html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
