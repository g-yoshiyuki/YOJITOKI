import { createTransport } from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const transporter = createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  // 管理人が受け取るメール
  const toHostMailData = {
    from: req.body.email,
    to: process.env.MAIL_USER,
    subject: `【お問い合わせ】${req.body.name}様より`,
    text: `${req.body.message} Send from ${req.body.email}`,
    html: `
    <p>【名前】</p>
    <p>${req.body.name}</p>
    <p>【メッセージ内容】</p>
    <p>${req.body.message}</p>
    <p>【メールアドレス】</p>
    <p>${req.body.email}</p>
    `,
  };

  transporter.sendMail(toHostMailData,function(err,info){
    if (err) console.log(err);
    else console.log(info)
  });

  res.status(200).json({
    success: true,
  });
};
