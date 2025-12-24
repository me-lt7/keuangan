import "./globals.css"
// import Nav from "./components/Nav";
import TransparentNav from "./components/TransparentNav";
import GradientBackground from "./components/GradientBackground";

export const metadata = {
  title: "Catatan Keuangan",
  description: "Aplikasi pencatat keuangan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06b6d4" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Catatan Keuangan" />
        <link rel="apple-touch-icon" href="/icons/icon1.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful');
                    }, function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `
          }}
        />
      </head>
      <body className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen text-slate-800">
        {/* Floating transparent nav */}
        <TransparentNav />
        {/* Decorative animated gradient background */}
        <GradientBackground />
        {/* add top padding to avoid floating nav overlapping content */}
        <main className="max-w-4xl mx-auto pt-24 sm:pt-28 py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
