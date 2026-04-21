import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function createMeeting({ summary, startTime, endTime }) {
    const event = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
        summary,
        start: { dateTime: startTime, timeZone: 'Asia/Kolkata' },
        end:   { dateTime: endTime,   timeZone: 'Asia/Kolkata' },
        conferenceData: {
            createRequest: {
            requestId: `mentor-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
        }
        }
    });

  return event.data.conferenceData?.entryPoints?.[0]?.uri;
}

