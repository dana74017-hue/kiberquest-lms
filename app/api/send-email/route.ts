import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, sendCopyToAdmin = false } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields (to, subject, html)" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Основное письмо пользователю
    const mailOptions: any = {
      from: `"KiberQuest" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    // Если нужно отправить копию админу (тебе)
    if (sendCopyToAdmin && process.env.GMAIL_USER) {
      mailOptions.cc = process.env.GMAIL_USER;
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}