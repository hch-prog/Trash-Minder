// app/rewards/page.tsx
'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { Coins, ArrowUpRight, ArrowDownRight, Gift, AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import axios from 'axios'

type Transaction = {
  id: number
  type: 'earned_report' | 'earned_collect' | 'redeemed'
  amount: number
  description: string
  date: string
}

type Reward = {
  id: number
  name: string
  cost: number
  description: string | null
  collectionInfo: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function RewardsPage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDataAndRewards = async () => {
      setLoading(true)
      try {
        console.log('Fetching user data and rewards...')
        if (session?.user?.email) {
          const userEmail = encodeURIComponent(session.user.email)
          console.log(`User email: ${session.user.email}`)

          const userResponse = await axios.get(`/api/user?email=${userEmail}`)
          console.log('User response:', userResponse)
          const userData = userResponse.data
          console.log('User data:', userData)

          if (userData) {
            setUser(userData)

            const transactionsResponse = await axios.get(`/api/transactions?userId=${userData.id}`)
            const transactionsData = transactionsResponse.data
            console.log('Transactions data:', transactionsData)
            setTransactions(transactionsData)

            const rewardsResponse = await axios.get(`/api/rewards?userId=${userData.id}`)
            const rewardsData = rewardsResponse.data
            console.log('Rewards data:', rewardsData)
            setRewards(rewardsData.filter((r: Reward) => r.cost > 0))
          } else {
            toast.error('User not found. Please log in again.')
          }
        } else {
          toast.error('User not logged in. Please log in.')
        }
      } catch (error) {
        console.error('Error fetching user data and rewards:', error)
        toast.error('Failed to load rewards data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      console.log('User is authenticated, fetching data...')
      fetchUserDataAndRewards()
    } else if (status === 'unauthenticated') {
      console.log('User is not authenticated.')
      setLoading(false)
    }
  }, [status, session])

  
  const balanceKey = user?.id ? `/api/balance?userId=${user.id}` : null
  const { data: balanceData } = useSWR(balanceKey, fetcher)

  const handleRedeemReward = async (rewardId: number) => {
    if (!user) {
      toast.error('Please log in to redeem rewards.')
      return
    }

    const reward = rewards.find(r => r.id === rewardId)
    if (reward && balanceData?.balance >= reward.cost && reward.cost > 0) {
      try {
        const response = await axios.post('/api/redeem', { userId: user.id, rewardId })

        if (response.status >= 200 && response.status < 300) {
          mutate(balanceKey) 
          fetchTransactions()
          toast.success(`You have successfully redeemed: ${reward.name}`)
          setRewards(prevRewards => prevRewards.filter(r => r.id !== rewardId))
        } else {
          throw new Error('Failed to redeem reward')
        }
      } catch (error) {
        console.error('Error redeeming reward:', error)
        toast.error('Failed to redeem reward. Please try again.')
      }
    } else {
      toast.error('Insufficient balance or invalid reward cost')
    }
  }


  const handleRedeemAllPoints = async () => {
    if (!user) {
      toast.error('Please log in to redeem points.')
      return
    }

    if (balanceData?.balance > 0) {
      try {
        const response = await axios.post('/api/redeem', {
          userId: user.id,
          rewardId: 0, 
        })

        if (response.status >= 200 && response.status < 300) {
          mutate(balanceKey) 
          fetchTransactions() 
          toast.success(`You have successfully redeemed all your points!`)
          setRewards([])
        } else {
          throw new Error('Failed to redeem all points')
        }
      } catch (error) {
        console.error('Error redeeming all points:', error)
        toast.error('Failed to redeem all points. Please try again.')
      }
    } else {
      toast.error('No points available to redeem')
    }
  }


  const fetchTransactions = async () => {
    if (user) {
      try {
        const transactionsResponse = await axios.get(`/api/transactions?userId=${user.id}`)
        const transactionsData = transactionsResponse.data
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Rewards</h1>

        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Rewards</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-full border-l-4 border-green-500 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reward Balance</h2>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Coins className="w-10 h-10 mr-3 text-green-500" />
            <div>
              <span className="text-4xl font-bold text-green-500">
                {balanceData ? balanceData.balance : '...'}
              </span>
              <p className="text-sm text-gray-500">Available Points</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    {transaction.type === 'earned_report' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-500 mr-3" />
                    ) : transaction.type === 'earned_collect' ? (
                      <ArrowUpRight className="w-5 h-5 text-blue-500 mr-3" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${transaction.type.startsWith('earned') ? 'text-green-500' : 'text-red-500'
                      }`}
                  >
                    {transaction.type.startsWith('earned') ? '+' : '-'}
                    {transaction.amount}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No transactions yet</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Rewards</h2>
          <div className="space-y-4">
            {rewards.length > 0 ? ( 
              rewards.map(reward => (
                <div key={reward.id} className="bg-white p-4 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{reward.name}</h3>
                    <span className="text-green-500 font-semibold">{reward.cost} points</span>
                  </div>
                  <p className="text-gray-600 mb-2">{reward.description}</p>
                  <p className="text-sm text-gray-500 mb-4">{reward.collectionInfo}</p>
                  {reward.id === 0 ? (
                    <div className="space-y-2">
                      <Button
                        onClick={handleRedeemAllPoints}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        disabled={!balanceData || balanceData.balance === 0}
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Redeem All Points
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleRedeemReward(reward.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      disabled={!balanceData || balanceData.balance < reward.cost}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Redeem Reward
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
                  <p className="text-yellow-700">No rewards available at the moment.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
