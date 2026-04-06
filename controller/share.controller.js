const ShareModel = require('../model/share.model')
const nodemailer = require('nodemailer')
const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)


// const conn = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD
//     }
// })

const getEmailTemplate = (link, filename, ext, size) => {
    return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>CloudKeep - File Shared</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f9;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0; background-color:#f4f6f9;">
                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

                            <!-- Header -->
                            <tr>
                                <td style="background:linear-gradient(90deg,#4f46e5,#6366f1); color:#ffffff; text-align:center; padding:25px;">
                                    <h1 style="margin:0; font-size:26px;">☁️ CloudKeep</h1>
                                    <p style="margin:5px 0 0; font-size:13px; opacity:0.9;">
                                        Secure. Simple. Always within reach.
                                    </p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
                                    
                                    <p style="margin:0 0 15px;">Hi,</p>

                                    <p style="margin:0 0 15px;">
                                        You've received a file via <strong>CloudKeep</strong>. Click the button below to securely download your file.
                                    </p>

                                    <!-- File Info -->
                                    <div style="background-color:#f9fafb; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #e5e7eb;">
                                        <p style="margin:0;"><strong>📄 File Name:</strong> ${filename}.${ext}</p>
                                        <p style="margin:6px 0 0;"><strong>📦 File Size:</strong> ${(size/(1024*1024)).toFixed(1)} Mb</p>
                                    </div>

                                    <!-- Download Button -->
                                    <div style="text-align:center; margin:30px 0;">
                                        <a href="${link}" 
                                        style="background-color:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-weight:bold; font-size:15px; display:inline-block;">
                                            ⬇️ Download File
                                        </a>
                                    </div>

                                    <!-- Expiration Notice 
                                    <div style="background-color:#fff4e5; color:#b45309; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #fde68a;">
                                        ⏳ <strong>Note:</strong> This file will expire on <strong>{{EXPIRATION_DATE}}</strong>.  
                                        Make sure to download it before it becomes unavailable.
                                    </div>-->

                                    <p style="margin:0 0 10px;">
                                        If you weren’t expecting this file, you can safely ignore this email.
                                    </p>

                                    <p style="margin:20px 0 0;">
                                        Best regards,<br>
                                        <strong>Team CloudKeep</strong>
                                    </p>

                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#f9fafb; text-align:center; padding:20px; font-size:12px; color:#6b7280;">
                                    <p style="margin:0 0 5px;">
                                        ☁️ CloudKeep — Secure file sharing made effortless
                                    </p>
                                    <p style="margin:0;">
                                        © ${new Date().getFullYear()} CloudKeep. All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>`
}

// const shareFile = async (req, res) => {
//     try
//     {
//         const {email, fileId, ext, filename, size} =req.body
//         const link = `${process.env.SERVER}/api/file/download/${fileId}`
        
//         const options = {
//             from: process.env.SMTP_EMAIL,
//             to: email,
//             subject: '☁️ CloudKeep: Just sent you a file',
//             html: getEmailTemplate(link, filename, ext,  size)
//         }

//         await conn.sendMail(options)
//         res.status(200).json({message: 'Email sent'})
//     }
//     catch(err)
//     {
//         console.error('Full error:', err)
//         console.error('Full error2:', err.message)
//         res.status(500).json({message: err.response ? err.response.data.message : err.message})
//     }
// }

const shareFile = async (req, res) => {
    try {
        const { email, fileId, ext, filename, size } = req.body
        const link = `${process.env.SERVER}/api/file/download/${fileId}`

        console.log(link);
        return

        if(!email || !fileId || !ext || !filename || !size)
        {
            return res.status(200).json({ message: 'Invalid Information' })
        }

        const payload = {
            user: req.user.id,
            receiverEmail: email,
            file: fileId
        }

        await Promise.all([
            resend.emails.send({
                from: `CloudKeep <${process.env.RESEND_FROM}>`,
                to: email,
                subject: '☁️ CloudKeep: Just sent you a file',
                html: getEmailTemplate(link, filename, ext, size)
            }),
            ShareModel.create(payload)
        ])

        res.status(200).json({ message: 'Email sent' })
    }
    catch (err) {
        console.error('Full error:', err)
        res.status(500).json({ message: err.message })
    }
}

const fetchShared = async (req, res) => {
    try
    {
        const {limit} = req.query
        const history = await ShareModel.find({user: req.user.id})
        .populate('file', 'filename size type')
        .sort({createdAt: -1})
        .limit(limit)

        res.status(200).json(history)
    }
    catch(err)
    {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    shareFile,
    fetchShared
}  