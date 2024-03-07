import TopNavigation from '@/components/TopNavigation'
import Footer from '@/components/Footer'

export default function CommonLayout({children}) {
    return (
        <div className="flex flex-col w-screen max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <TopNavigation/>
            <div className="py-8 flex-1">
                {children}
            </div>
            <Footer/>
        </div>
    )
}
