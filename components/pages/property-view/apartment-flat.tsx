'use client'

import React, { useState } from 'react'
import {
	Heart,
	Share2,
	ShoppingCart,
	MapPin,
	Car,
	Droplets,
	Zap,
	Shield,
	Building2,
	Trees,
	Dumbbell,
	Waves,
	User as UserIcon,
	Home,
	Users,
	Bath,
	Mountain,
	ArrowUp,
	CheckCircle,
} from 'lucide-react'
import Image from 'next/image'
import { Prisma } from '@prisma/client'
import PropertyMap from '@/components/map'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type PropertyWithAll = Prisma.PropertyGetPayload<{
	include: {
		apartmentFlat: true
		location: true
		owner: true
	}
}>

export default function ApartmentFlatViewPage({ property }: { property: PropertyWithAll }) {
	const [activeImage, setActiveImage] = useState(0)
	const [isWishlisted, setIsWishlisted] = useState(false)
	const [cartLoading, setCartLoading] = useState(false)

	async function addToCart() {
		try {
			setCartLoading(true)
			const response = await fetch('/api/user/cart/add', {
				method: 'POST',
				body: JSON.stringify(property.id),
			})
			if (response.ok) {
				toast.success('Property added to cart successfully')
			}
			console.log(response)
		} catch (error) {
			toast.error('Property Already in cart')
			console.log(error)
		} finally {
			setCartLoading(false)
		}
	}

	const apartment = property.apartmentFlat

	if (!apartment) {
		return <div>Apartment details not available.</div>
	}

	const formatPrice = (price: number): string => {
		console.log(price, 'price here')
		if (price >= 10000000) {
			const crores = price / 10000000
			return `${crores.toFixed(2)} Crore`
		}
		if (price >= 100000) {
			const lakhs = price / 100000
			return `${lakhs.toFixed(0)} Lakh`
		}
		return price.toLocaleString('en-IN') + ' INR' // or just `₹${price.toLocaleString()}`
	}

	const pricePerSqFt = Math.round(property.price / apartment.carpetArea!)

	const basicAmenities = [
		{ icon: Zap, label: '24/7 Power Backup', available: apartment.hasPowerBackup },
		{ icon: Car, label: 'Car Parking', available: apartment.parking },
		{ icon: ArrowUp, label: 'Lift', available: apartment.hasLift },
		{ icon: Shield, label: '24x7 Security', available: apartment.hasSecurity },
		{ icon: Building2, label: 'CCTV Camera Security', available: apartment.hasSecurity },
	]

	const lifestyleAmenities = [
		{ icon: Dumbbell, label: 'Gymnasium', available: apartment.hasGym },
		{ icon: Waves, label: 'Swimming Pool', available: apartment.hasSwimmingPool },
		{ icon: Trees, label: 'Garden/Park', available: apartment.hasGarden },
		{ icon: Shield, label: 'Security Cabin', available: apartment.hasSecurity },
	]

	return (
		<div className="min-h-screen bg-blue-200">
			<MaxWidthWrapper className="py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Image Gallery */}
						<div className="bg-white rounded-2xl overflow-hidden shadow-lg">
							<div className="relative">
								<Image
									width={1200}
									height={500}
									src={property.images[activeImage]}
									alt={property.title}
									className="w-full h-96 object-cover"
								/>
								<button
									onClick={() => setIsWishlisted(!isWishlisted)}
									className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
									<Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
								</button>
								<div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
									+{property.images.length - 1}
								</div>
							</div>
							<div className="p-4">
								<div className="grid grid-cols-4 gap-2">
									{property.images.map((img, index) => (
										<Image
											width={1200}
											height={500}
											key={index}
											src={img}
											alt={`View ${index + 2}`}
											className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
											onClick={() => setActiveImage(index)}
										/>
									))}
								</div>
							</div>
						</div>

						{/* Property Details */}
						<div className="bg-white rounded-2xl p-6 shadow-lg">
							<div className="flex justify-between items-start mb-6">
								<div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
									<div className="flex items-center text-gray-600 mb-4">
										<MapPin className="w-4 h-4 mr-1" />
										<span>{property.location.address}</span>
									</div>
								</div>
								<button className="p-2 hover:bg-gray-100 rounded-full">
									<Share2 className="w-5 h-5 text-gray-600" />
								</button>
							</div>

							{/* Price and Area */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
									<div className="text-3xl font-bold text-gray-900 mb-2">₹{formatPrice(property.price)}</div>
									<div className="text-gray-600">Base Price: ₹{pricePerSqFt.toLocaleString()} Per Sq.Ft.</div>
								</div>
								<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
									<div className="text-2xl font-bold text-gray-900 mb-2">
										{apartment.carpetArea} - {apartment.builtUpArea} sq.ft.
									</div>
									<div className="text-gray-600">Super Built Up Area</div>
								</div>
							</div>

							{/* Property Info Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Home className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{apartment.bhk}</div>
									<div className="text-sm text-gray-600">Configuration (BHK)</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Bath className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{apartment.bathrooms}</div>
									<div className="text-sm text-gray-600">Bathrooms</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">
										{apartment.floorNumber}/{apartment.totalFloors}
									</div>
									<div className="text-sm text-gray-600">Floor</div>
								</div>
								<div className="text-center p-4 bg-gray-50 rounded-lg">
									<Mountain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
									<div className="font-semibold">{apartment.facingDirection}</div>
									<div className="text-sm text-gray-600">Facing</div>
								</div>
							</div>

							{/* Amenities */}
							<div className="space-y-6">
								<h3 className="text-xl font-semibold">Amenities</h3>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">BASIC</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{basicAmenities.map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												<amenity.icon className="w-5 h-5 text-blue-600" />
												<span className="text-sm text-gray-700">{amenity.label}</span>
												{amenity.available && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-medium text-gray-900 mb-3">LIFESTYLE</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{lifestyleAmenities.map((amenity, index) => (
											<div key={index} className="flex items-center space-x-2">
												<amenity.icon className="w-5 h-5 text-blue-600" />
												<span className="text-sm text-gray-700">{amenity.label}</span>
												{amenity.available && <CheckCircle className="w-4 h-4 text-green-500" />}
											</div>
										))}
									</div>
								</div>
							</div>

							{/* About Property */}
							<div className="mt-8 pt-6 border-t">
								<h3 className="text-xl font-semibold mb-4">More About This Property</h3>
								<div className="space-y-2 text-gray-700">
									<p>
										<strong>Address:</strong> {property.location.address}
									</p>
									<p>
										<strong>RERA Number:</strong> {apartment.reraNumber}
									</p>
									<p>
										<strong>Age of Property:</strong>{' '}
										{apartment.ageOfProperty === 0 ? 'New Launch' : `${apartment.ageOfProperty} years`}
									</p>
									<p>
										<strong>Furnishing:</strong> {apartment.furnishingStatus.replace('_', ' ')}
									</p>
									<p className="mt-4">{property.description}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div>
						{/* Action Buttons */}
						<div className="bg-white rounded-2xl p-6 shadow-lg sticky top-4 gap-2">
							<div className="flex flex-col gap-2">
								<Button>Buy Now</Button>
								<Button onClick={addToCart} disabled={cartLoading}>
									<ShoppingCart className="w-5 h-5" />
									<span>Add Cart</span>
								</Button>
							</div>

							{/* Contact */}
							<div className="mt-6 pt-6 border-t">
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
										<UserIcon className="w-6 h-6 text-gray-600" />
									</div>
									<div>
										<div className="font-semibold">{property.owner.firstName + ' ' + property.owner.lastName}</div>
										<div className="text-sm text-gray-600">Property Owner</div>
									</div>
								</div>
								<button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
									Contact Owner
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<PropertyMap latitude={property.googleMapLat!} longitude={property.googleMapLng!} propertyName={property.title} />
				</div>
			</MaxWidthWrapper>
		</div>
	)
}
