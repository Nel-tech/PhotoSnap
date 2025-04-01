  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="relative group">
      <Image 
        src={StoriesImage} 
        alt="Stories" 
        className="w-full h-[400px] object-cover rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">The Mountains</h3>
        <p className="text-sm">by John Appleseed</p>
      </div>
    </div>
  </div>
  <div className="flex items-center gap-4">
    <Separator className="bg-white opacity-30 w-[100px]" />
    <h2 className="text-4xl font-bold text-white">LAST MONTH'S FEATURED STORY</h2>
  </div> 