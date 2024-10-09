'use client'
import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import axios from 'axios'

type UserSettings = {
  name: string
  email: string
  number: string
  address: string
  notifications: boolean 
}

function SettingsLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader className="animate-spin text-green-500 h-16 w-16 mb-4" />
      <p className="text-gray-600 font-medium">Loading settings, please wait...</p>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    number: '',
    address: '',
    notifications: true,
  })
  const [loading, setLoading] = useState(true)

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchSettings = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        setLoading(true)
        try {
            const response = await axios.get(`/api/setting?email=${encodeURIComponent(session.user.email)}`)
            if (response.status >= 200 && response.status < 300) {
              const data = response.data
              setSettings({
                name: data.name || 'John Doe',
                email: data.email || session.user.email,
                number: data.number || '+1 234 567 8900',
                address: data.address || '123 Eco Street, Green City, 12345',
                notifications: true,
              })
            } else {
              toast.error('Failed to load user settings')
            }
          } catch (error) {
            toast.error('Error fetching user settings')
          } finally {
            setLoading(false)
          }
      }
    }

    fetchSettings()
  }, [session, status])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.put('/api/setting', {
        email: settings.email,
        name: settings.name,
        number: settings.number,
        address: settings.address,
      })

      if (response.status==200) {
        toast.success('Settings updated successfully!')
      } else {
        toast.error('Failed to update settings')
      }
    } catch (error) {
      toast.error('Error updating settings')
    }
  }

  if (loading) {
    return <SettingsLoader /> 
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Account Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={settings.name}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              readOnly
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-gray-100 cursor-not-allowed"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              id="number"
              name="number"
              value={settings.number}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <div className="relative">
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </form>
    </div>
  )
}