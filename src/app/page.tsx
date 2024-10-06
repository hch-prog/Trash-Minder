'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const poppins = Poppins({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
      <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />
    </div>
  )
}

const getRecentReports = async (limit: number = 10) => {
  try {
    const response = await fetch(`/api/getrecentreports?limit=${limit}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error('Failed to fetch recent reports:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return [];
  }
};

const getAllRewards = async () => {
  try {
    const response = await fetch('/api/getallrewards');
    const rewards = await response.json();

    if (response.ok) {
      console.log('Fetched rewards:', rewards);
      return rewards;
    } else {
      console.error('Failed to fetch rewards:', rewards.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }
}

const getWasteCollectionTasks = async (limit: number = 20) => {
  try {
    const response = await axios.get(`/api/getwastecollectiontasks?limit=${limit}`);
    console.log('Waste collection tasks:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching waste collection tasks:', error);
    return [];
  }
}

async function getUserByEmail(userEmail: string) {
  try {
    const response = await axios.post('/api/useremail', { email: userEmail });
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

async function getAvailableRewards(userId: number) {
  try {
    const response = await fetch(`/api/getavailablerewards?userId=${userId}`);
    const rewards = await response.json();

    if (response.ok) {
      console.log("Available rewards:", rewards);
      return rewards;
    } else {
      console.error("Failed to fetch rewards:", rewards.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching available rewards:", error);
    return [];
  }
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { data: session, status } = useSession();

  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalEarnings = async () => {
      try {
        if (status === "authenticated" && session?.user?.email) {
          const user = await getUserByEmail(session.user.email);
          if (user) {
            const availableRewards = await getAvailableRewards(user.id);
            setTotalEarnings(availableRewards);
          }
        }
      } catch (error) {
        console.error("Error fetching total earnings:", error);
      }
    };

    fetchTotalEarnings();
  }, [session, status]);

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const reports = await getRecentReports(100);
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(20);

        const wasteCollected = tasks.reduce((total: number, task: any) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);

        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce((total: number, reward: any) => total + (reward.points || 0), 0);
        const co2Offset = wasteCollected * 0.5;  

        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10) / 10,
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10) / 10
        });

        setIsLoading(false); // Data has finished loading
      } catch (error) {
        console.error("Error fetching impact data:", error);

        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0
        });

        setIsLoading(false); 
      }
    }

    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div className={`container mx-auto px-4 py-16 ${poppins.className}`}>
      <section className="text-center mb-20">
        <AnimatedGlobe />
        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
          Zero-to-Hero <span className="text-green-600">Waste Management</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Join our community in making waste management more efficient and rewarding!
        </p>
        {!loggedIn ? (
          <Button onClick={login} className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Link href="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
              Report Waste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-10 mb-20">
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Be part of a growing community committed to sustainable practices."
        />
      </section>

      <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Recycle} isLoading={isLoading} />
          <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} isLoading={isLoading} />
          <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} isLoading={isLoading} />
          <ImpactCard title="CO2 Offset" value={`${impactData.co2Offset} kg`} icon={Leaf} isLoading={isLoading} />
        </div>
      </section>
    </div>
  )
}

function ImpactCard({ title, value, icon: Icon, isLoading }: Readonly<{ title: string; value: string | number; icon: React.ElementType; isLoading: boolean }>) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;

  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md flex flex-col items-center">
      <div className="mb-4">
        {isLoading ? (
          <Icon className="h-10 w-10 text-gray-300 animate-pulse" />
        ) : (
          <Icon className="h-10 w-10 text-green-500" />
        )}
      </div>
      <p className="text-3xl font-bold mb-2 text-gray-800">
        {isLoading ? (
          <span className="block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
        ) : (
          formattedValue
        )}
      </p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: Readonly<{ icon: React.ElementType; title: string; description: string }>) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}