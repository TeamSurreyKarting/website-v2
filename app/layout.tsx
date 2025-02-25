import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import { CircleAlert } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLocalDev = process.env.LOCAL_DEV === 'TRUE';

  return (
    <html lang={"en"} suppressHydrationWarning>
      <body className={`${inter.className}`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        { isLocalDev && (
          <div className={"absolute w-full h-4 bg-orange-700 flex flex-row items-center justify-center z-[100] text-xs"}>
            <CircleAlert className={"h-3"} />
            <p>Development Build</p>
          </div>
          )
        }
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
