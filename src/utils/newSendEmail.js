import crypto from 'crypto';
import { FROM_SUPPORT_EMAIL, SUPPORT_EMAIL, HOST, LOGO_URL } from '../config/config.js';
import SendEmail from './awsSES.js';
import User from '../models/userModel.js';

export class SendEmail {
  confirmEmail = async (email) => {
    try {
      //  Generate token for email verification link and save it to database
      const token = crypto.randomBytes(20).toString('hex');

      await User.findOneAndUpdate({ email: email }, { token: token });

      // Create Verification url for email
      const verificationUrl = `${HOST}/r/confirm/${token}`;
      console.log(verificationUrl);

      // Template for email message
      const data = {
        Source: FROM_SUPPORT_EMAIL,
        Destination: {
          ToAddresses: [`${email}`],
        },
        subject: 'Email Verification',
        html: `<!DOCTYPE html>
        <html
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
            margin: 0;
          "
        >
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Please confirm your email</title>
        
            <style type="text/css">
              img {
                max-width: 100%;
              }
              body {
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
                height: 100%;
                line-height: 1.6em;
              }
              body {
                background-color: #f6f6f6;
              }
              @media only screen and (max-width: 640px) {
                body {
                  padding: 0 !important;
                }
                h1 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h2 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h3 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h4 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h1 {
                  font-size: 22px !important;
                }
                h2 {
                  font-size: 18px !important;
                }
                h3 {
                  font-size: 16px !important;
                }
                .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                .content {
                  padding: 0 !important;
                }
                .content-wrap {
                  padding: 10px !important;
                }
                .invoice {
                  width: 100% !important;
                }
              }
            </style>
          </head>
        
          <body
            itemscope
            itemtype="http://schema.org/EmailMessage"
            style="
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              height: 100%;
              line-height: 1.6em;
              background-color: #f6f6f6;
              margin: 0;
            "
            bgcolor="#f6f6f6"
          >
            <table
              class="body-wrap"
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                width: 100%;
                background-color: #f6f6f6;
                margin: 0;
              "
              bgcolor="#f6f6f6"
            >
              <tr
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  margin: 0;
                "
              >
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    margin: 0;
                  "
                  valign="top"
                ></td>
                <td
                  class="container"
                  width="600"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    display: block !important;
                    max-width: 600px !important;
                    clear: both !important;
                    margin: 0 auto;
                  "
                  valign="top"
                >
                  <div
                    class="content"
                    style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      box-sizing: border-box;
                      font-size: 14px;
                      max-width: 600px;
                      display: block;
                      margin: 0 auto;
                      padding: 20px;
                    "
                  >
                    <table
                      class="main"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      itemprop="action"
                      itemscope
                      itemtype="http://schema.org/ConfirmAction"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        border-radius: 3px;
                        background-color: #fff;
                        margin: 0;
                        border: 1px solid #e9e9e9;
                      "
                      bgcolor="#fff"
                    >
                      <tr
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <td
                          class="content-wrap"
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            vertical-align: top;
                            margin: 0;
                            padding: 20px;
                          "
                          valign="top"
                        >
                          <meta
                            itemprop="name"
                            content="Confirm Email"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          />
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <img
                                  src="${LOGO_URL}"
                                  alt="DataForms"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    max-width: 100%;
                                    margin: 0;
                                    padding: 0;
                                    border: none;
                                    display: block;
                                  "
                                />
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                ${email}
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                You have one more step remaining to activate your DataForms account. Click on the button below
                                to verify your email address:
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                itemprop="handler"
                                itemscope
                                itemtype="http://schema.org/HttpActionHandler"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <a
                                  href="${verificationUrl}"
                                  class="btn-primary"
                                  itemprop="url"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    color: #fff;
                                    text-decoration: none;
                                    line-height: 2em;
                                    font-weight: bold;
                                    text-align: center;
                                    cursor: pointer;
                                    display: inline-block;
                                    border-radius: 5px;
                                    text-transform: capitalize;
                                    background-color: #348eda;
                                    margin: 0;
                                    border-color: #348eda;
                                    border-style: solid;
                                    border-width: 10px 20px;
                                  "
                                  >Confirm email address</a
                                >
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  color: #777777;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                Didn’t work? Copy the link below into your web browser:
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                itemprop="url"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <a
                                  href="${verificationUrl}"
                                  itemprop="url"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 15px;
                                    color: #348eda;
                                    text-decoration: underline;
                                    line-height: 2em;
                                    font-weight: bold;
                                    text-align: center;
                                    display: inline-block;
                                    border-radius: 5px;
                                    margin: 0;
                                  "
                                  >${verificationUrl}</a
                                >
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                Best Regards,
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                &mdash; Team DataForms
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <div
                      class="footer"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        width: 100%;
                        clear: both;
                        color: #999;
                        margin: 0;
                        padding: 20px;
                      "
                    >
                      <table
                        width="100%"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="aligncenter content-block"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 12px;
                              vertical-align: top;
                              color: #999;
                              text-align: center;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            align="center"
                            valign="top"
                          >
                            Questions? Email us at
                            <a
                              href="mailto: ${SUPPORT_EMAIL}"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 12px;
                                color: #999;
                                text-decoration: underline;
                                margin: 0;
                              "
                              >${SUPPORT_EMAIL}</a
                            >
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </td>
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    margin: 0;
                  "
                  valign="top"
                ></td>
              </tr>
            </table>
          </body>
        </html>
        `,
      };

      // Sending email
      try {
        const response = await SendEmail(data);
        console.log(response);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  /**
   * @description Verify email address after changing in the profile
   * @param email Email address to verify
   * @alias verifyEmail (email)
   */
  sendVerificationEmail = async (id, email) => {
    try {
      const token = crypto.randomBytes(20).toString('hex');

      const verificationUrl = `${HOST}/verify/${token}`;

      await this.userService.savedToken(id, token);

      // Template for email message
      const data = {
        from: `${FROM_SUPPORT_EMAIL}`,
        to: email,
        subject: 'Verify your email address',
        'o-tracking': 'yes',
        'o-tracking-clicks': 'yes',
        'o-tracking-opens': 'yes',
        'o:tag': ['verify-email'],
        html: `<!DOCTYPE html>
        <html
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
            margin: 0;
          "
        >
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Please verify your email</title>
        
            <style type="text/css">
              img {
                max-width: 100%;
              }
              body {
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
                height: 100%;
                line-height: 1.6em;
              }
              body {
                background-color: #f6f6f6;
              }
              @media only screen and (max-width: 640px) {
                body {
                  padding: 0 !important;
                }
                h1 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h2 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h3 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h4 {
                  font-weight: 800 !important;
                  margin: 20px 0 5px !important;
                }
                h1 {
                  font-size: 22px !important;
                }
                h2 {
                  font-size: 18px !important;
                }
                h3 {
                  font-size: 16px !important;
                }
                .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                .content {
                  padding: 0 !important;
                }
                .content-wrap {
                  padding: 10px !important;
                }
                .invoice {
                  width: 100% !important;
                }
              }
            </style>
          </head>
        
          <body
            itemscope
            itemtype="http://schema.org/EmailMessage"
            style="
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              height: 100%;
              line-height: 1.6em;
              background-color: #f6f6f6;
              margin: 0;
            "
            bgcolor="#f6f6f6"
          >
            <table
              class="body-wrap"
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                width: 100%;
                background-color: #f6f6f6;
                margin: 0;
              "
              bgcolor="#f6f6f6"
            >
              <tr
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  margin: 0;
                "
              >
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    margin: 0;
                  "
                  valign="top"
                ></td>
                <td
                  class="container"
                  width="600"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    display: block !important;
                    max-width: 600px !important;
                    clear: both !important;
                    margin: 0 auto;
                  "
                  valign="top"
                >
                  <div
                    class="content"
                    style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      box-sizing: border-box;
                      font-size: 14px;
                      max-width: 600px;
                      display: block;
                      margin: 0 auto;
                      padding: 20px;
                    "
                  >
                    <table
                      class="main"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      itemprop="action"
                      itemscope
                      itemtype="http://schema.org/ConfirmAction"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        border-radius: 3px;
                        background-color: #fff;
                        margin: 0;
                        border: 1px solid #e9e9e9;
                      "
                      bgcolor="#fff"
                    >
                      <tr
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <td
                          class="content-wrap"
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            vertical-align: top;
                            margin: 0;
                            padding: 20px;
                          "
                          valign="top"
                        >
                          <meta
                            itemprop="name"
                            content="Verify Email"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          />
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <img
                                  src="https://nextdevclouds.blob.core.windows.net/dataforms/Logo.png"
                                  alt="DataForms"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    max-width: 100%;
                                    margin: 0;
                                    padding: 0;
                                    border: none;
                                    display: block;
                                  "
                                />
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                ${email}
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                You have one more step remaining to verify your new email address. Click on the button below to
                                verify your email address:
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                itemprop="handler"
                                itemscope
                                itemtype="http://schema.org/HttpActionHandler"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <a
                                  href="${verificationUrl}"
                                  class="btn-primary"
                                  itemprop="url"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 14px;
                                    color: #fff;
                                    text-decoration: none;
                                    line-height: 2em;
                                    font-weight: bold;
                                    text-align: center;
                                    cursor: pointer;
                                    display: inline-block;
                                    border-radius: 5px;
                                    text-transform: capitalize;
                                    background-color: #348eda;
                                    margin: 0;
                                    border-color: #348eda;
                                    border-style: solid;
                                    border-width: 10px 20px;
                                  "
                                  >Verfiy email address</a
                                >
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  color: #777777;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                Didn’t work? Copy the link below into your web browser:
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                itemprop="url"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                <a
                                  href="${verificationUrl}"
                                  itemprop="url"
                                  style="
                                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                    box-sizing: border-box;
                                    font-size: 15px;
                                    color: #348eda;
                                    text-decoration: underline;
                                    line-height: 2em;
                                    font-weight: bold;
                                    text-align: center;
                                    display: inline-block;
                                    border-radius: 5px;
                                    margin: 0;
                                  "
                                  >${verificationUrl}</a
                                >
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                Best Regards,
                              </td>
                            </tr>
                            <tr
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                margin: 0;
                              "
                            >
                              <td
                                class="content-block"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  vertical-align: top;
                                  margin: 0;
                                  padding: 0 0 20px;
                                "
                                valign="top"
                              >
                                &mdash; Team DataForms
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <div
                      class="footer"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        width: 100%;
                        clear: both;
                        color: #999;
                        margin: 0;
                        padding: 20px;
                      "
                    >
                      <table
                        width="100%"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <tr
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <td
                            class="aligncenter content-block"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 12px;
                              vertical-align: top;
                              color: #999;
                              text-align: center;
                              margin: 0;
                              padding: 0 0 20px;
                            "
                            align="center"
                            valign="top"
                          >
                            Questions? Email us at
                            <a
                              href="mailto: ${SUPPORT_EMAIL}"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 12px;
                                color: #999;
                                text-decoration: underline;
                                margin: 0;
                              "
                              >${SUPPORT_EMAIL}</a
                            >
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </td>
                <td
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    vertical-align: top;
                    margin: 0;
                  "
                  valign="top"
                ></td>
              </tr>
            </table>
          </body>
        </html>
        `,
      };

      // Send email
      try {
        this.client.messages
          .create(MAILGUN_DOMAIN, data)
          .then((msg) => {
            console.log(msg);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  };

  forgotPassword = async (user, res) => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    await User.findOneAndUpdate({ email: user.email }, { token: resetToken });

    const resetUrl = `${HOST}/api/auth/resetpassword/${resetToken}`;

    // Create message object
    const data = {
      from: FROM_SUPPORT_EMAIL,
      to: `${user.name} <${user.email}>`,
      subject: 'Password Reset Request',
      html: `<!DOCTYPE html>
      <html
        style="
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          box-sizing: border-box;
          font-size: 14px;
          margin: 0;
        "
      >
        <head>
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>Password Reset Request</title>
      
          <style type="text/css">
            img {
              max-width: 100%;
            }
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              height: 100%;
              line-height: 1.6em;
            }
            body {
              background-color: #f6f6f6;
            }
            @media only screen and (max-width: 640px) {
              body {
                padding: 0 !important;
              }
              h1 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
              }
              h2 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
              }
              h3 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
              }
              h4 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
              }
              h1 {
                font-size: 22px !important;
              }
              h2 {
                font-size: 18px !important;
              }
              h3 {
                font-size: 16px !important;
              }
              .container {
                padding: 0 !important;
                width: 100% !important;
              }
              .content {
                padding: 0 !important;
              }
              .content-wrap {
                padding: 10px !important;
              }
              .invoice {
                width: 100% !important;
              }
            }
          </style>
        </head>
      
        <body
          style="
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            box-sizing: border-box;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6em;
            background-color: #f6f6f6;
            margin: 0;
          "
          bgcolor="#f6f6f6"
        >
          <table
            class="body-wrap"
            style="
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              width: 100%;
              background-color: #f6f6f6;
              margin: 0;
            "
            bgcolor="#f6f6f6"
          >
            <tr
              style="
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                font-size: 14px;
                margin: 0;
              "
            >
              <td
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  vertical-align: top;
                  margin: 0;
                "
                valign="top"
              ></td>
              <td
                class="container"
                width="600"
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  vertical-align: top;
                  display: block !important;
                  max-width: 600px !important;
                  clear: both !important;
                  margin: 0 auto;
                "
                valign="top"
              >
                <div
                  class="content"
                  style="
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    box-sizing: border-box;
                    font-size: 14px;
                    max-width: 600px;
                    display: block;
                    margin: 0 auto;
                    padding: 20px;
                  "
                >
                  <table
                    class="main"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    itemprop="action"
                    style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      box-sizing: border-box;
                      font-size: 14px;
                      border-radius: 3px;
                      background-color: #fff;
                      margin: 0;
                      border: 1px solid #e9e9e9;
                    "
                    bgcolor="#fff"
                  >
                    <tr
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        margin: 0;
                      "
                    >
                      <td
                        class="content-wrap"
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          vertical-align: top;
                          margin: 0;
                          padding: 20px;
                        "
                        valign="top"
                      >
                        <meta
                          itemprop="name"
                          content="Confirm Email"
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        />
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 14px;
                            margin: 0;
                          "
                        >
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              <img
                                src="https://nextdevclouds.blob.core.windows.net/dataforms/Logo.png"
                                alt="DataFormsJS"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  max-width: 100%;
                                  margin: 0;
                                  padding: 0;
                                  border: none;
                                  display: block;
                                "
                              />
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              <hr style="border: 1px solid #e9e9e9" />
                              <h1>Reset your password</h1>
                              <p style="color: #333333; font-size: 22px; font-weight: bold; text-align: left">
                                Dear <b>${user.name}</b>,
                              </p>
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 15px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                                color: #51545e;
                                line-height: 1.625;
                              "
                              valign="top"
                            >
                              We received a request to reset the password for your account. If you did not make this request,
                              please ignore this email.To reset your password, please click on the link below:
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              itemprop="handler"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              <a
                                href="${resetUrl}"
                                class="btn-primary"
                                itemprop="url"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 14px;
                                  color: #fff;
                                  text-decoration: none;
                                  line-height: 2em;
                                  font-weight: bold;
                                  text-align: center;
                                  cursor: pointer;
                                  display: inline-block;
                                  border-radius: 5px;
                                  text-transform: capitalize;
                                  background-color: #348eda;
                                  margin: 0;
                                  border-color: #348eda;
                                  border-style: solid;
                                  border-width: 10px 20px;
                                "
                                >Reset your password</a
                              >
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 16px;
                                vertical-align: top;
                                padding: 0 0 20px;
                                line-height: 1.625;
                                color: #51545e;
                                margin: 0.4em 0 1.1875em;
                              "
                              valign="top"
                            >
                              <strong>This password reset is only valid for the next 24 hours.</strong>
                            </td>
                          </tr>
      
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                color: #777777;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              Didn’t work? Copy the link below into your web browser:
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              itemprop="url"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              <a
                                href="${resetUrl}"
                                itemprop="url"
                                style="
                                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                  box-sizing: border-box;
                                  font-size: 15px;
                                  color: #348eda;
                                  text-decoration: underline;
                                  line-height: 2em;
                                  font-weight: bold;
                                  text-align: center;
                                  display: inline-block;
                                  border-radius: 5px;
                                  margin: 0;
                                "
                                >${resetUrl}</a
                              >
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              Best Regards,
                            </td>
                          </tr>
                          <tr
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 14px;
                              margin: 0;
                            "
                          >
                            <td
                              class="content-block"
                              style="
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                box-sizing: border-box;
                                font-size: 14px;
                                vertical-align: top;
                                margin: 0;
                                padding: 0 0 20px;
                              "
                              valign="top"
                            >
                              &mdash; Team DataForms
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <div
                    class="footer"
                    style="
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      box-sizing: border-box;
                      font-size: 14px;
                      width: 100%;
                      clear: both;
                      color: #999;
                      margin: 0;
                      padding: 20px;
                    "
                  >
                    <table
                      width="100%"
                      style="
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        box-sizing: border-box;
                        font-size: 14px;
                        margin: 0;
                      "
                    >
                      <tr
                        style="
                          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                          box-sizing: border-box;
                          font-size: 14px;
                          margin: 0;
                        "
                      >
                        <td
                          class="aligncenter content-block"
                          style="
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            box-sizing: border-box;
                            font-size: 12px;
                            vertical-align: top;
                            color: #999;
                            text-align: center;
                            margin: 0;
                            padding: 0 0 20px;
                          "
                          align="center"
                          valign="top"
                        >
                          Questions? Email us at
                          <a
                            href="mailto: ${SUPPORT_EMAIL}"
                            style="
                              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                              box-sizing: border-box;
                              font-size: 12px;
                              color: #999;
                              text-decoration: underline;
                              margin: 0;
                            "
                            >${SUPPORT_EMAIL}</a
                          >
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </td>
              <td
                style="
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  box-sizing: border-box;
                  font-size: 14px;
                  vertical-align: top;
                  margin: 0;
                "
                valign="top"
              ></td>
            </tr>
          </table>
        </body>
      </html>
      `,
    };

    // Send email
    try {
      this.client.messages
        .create(MAILGUN_DOMAIN, data)
        .then((msg) => {
          console.log(msg);
          res.status(200).json({ message: 'Email sent' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'Email not sent' });
        });
    } catch (err) {}
  };
}
