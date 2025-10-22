# VideoCall - Professional Video Calling Application

A sophisticated video calling application built with Next.js and Stream Video SDK, featuring HD video calls, user management, and seamless link sharing.

## Features

- 🎥 **HD Video Calls** - Crystal clear video quality powered by Stream Video SDK
- 👥 **Multi-User Support** - Connect with multiple participants in one call
- 🔐 **User Authentication** - Simple and secure user management
- 🔗 **Link Sharing** - Easy call invitation via shareable links
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI/UX** - Beautiful and intuitive interface
- ⚡ **Real-time** - Low-latency video calling experience

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Video SDK**: Stream Video SDK
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stream account with API credentials

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd video-call-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Stream credentials:

```env
NEXT_PUBLIC_STREAM_API_KEY=your_api_key_here
STREAM_API_SECRET=your_api_secret_here
STREAM_APP_ID=your_app_id_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Call

1. Enter your display name and optional email
2. Click "Start Video Call" to create a new call
3. Share the generated call ID or link with participants
4. Click "Join Call" to enter the video call

### Joining a Call

1. Enter the call ID provided by the host
2. Click "Join Call" to enter the video call

### During a Call

- **Mute/Unmute**: Click the microphone button
- **Turn Video On/Off**: Click the video camera button
- **Leave Call**: Click the phone button
- **View Participants**: Participants list is shown at the bottom
- **Call Stats**: Click the stats button for call information

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── call/[callId]/     # Dynamic call pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LoginForm.tsx      # User authentication
│   └── VideoCall.tsx      # Video call interface
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utility functions
    ├── stream-client.ts   # Stream SDK configuration
    └── utils.ts           # Helper functions
```

## Environment Variables

| Variable                     | Description                          | Required |
| ---------------------------- | ------------------------------------ | -------- |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream API key (public)              | Yes      |
| `STREAM_API_SECRET`          | Stream API secret (server-side only) | Yes      |
| `STREAM_APP_ID`              | Stream application ID                | Yes      |

## Stream Video SDK Setup

This application uses [Stream Video SDK](https://getstream.io/video/) for video calling functionality. Make sure you have:

1. A Stream account
2. A video calling application created
3. Valid API credentials

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the [Stream Video SDK documentation](https://getstream.io/video/docs/)
- Open an issue in this repository
- Contact support at [getstream.io](https://getstream.io)

---

Built with ❤️ using Next.js and Stream Video SDK
