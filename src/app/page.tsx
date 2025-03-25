// src/app/page.tsx
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400"> {/* Matching gradient background */}
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-200 drop-shadow-lg"> {/* Bold and intriguing header */}
        Explore Your Future
      </h1>
      <p className="mb-6 text-yellow-100 text-lg text-center max-w-md">
        Unlock career paths tailored to your interests and skills. Start your journey of discovery!
      </p>
      <Link href="/questionnaire">
        <button className="bg-purple-700 text-yellow-100 px-6 py-3 rounded-full hover:bg-orange-500 transition-transform transform hover:scale-105">
          Begin the Adventure
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
