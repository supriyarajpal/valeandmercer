import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, address, postcode, propertyType, bedrooms, reason } = body

    const html = '<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px;background:#EFECE6"><h2 style="font-size:24px;font-weight:300;color:#28231C;border-bottom:1px solid #DDD7CC;padding-bottom:16px;margin-bottom:24px">Vale & Mercer: Valuation Request</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px;width:160px">Name</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + firstName + ' ' + lastName + '</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px">Email</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + email + '</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + phone + '</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px">Address</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + address + ', ' + postcode + '</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px">Property Type</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + propertyType + '</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#9A9188;font-size:12px">Bedrooms</td><td style="padding:10px 0;border-bottom:1px solid #DDD7CC;color:#28231C;font-size:14px">' + bedrooms + '</td></tr><tr><td style="padding:10px 0;color:#9A9188;font-size:12px">Reason</td><td style="padding:10px 0;color:#28231C;font-size:14px">' + reason + '</td></tr></table><p style="margin-top:32px;font-size:11px;color:#9A9188">Sent from valeandmercer.co.uk</p></div>'

    await resend.emails.send({
      from: 'Vale and Mercer <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'rghvrjpl@gmail.com'],
      subject: 'Valuation request: ' + address + ' ' + postcode,
      html: html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
