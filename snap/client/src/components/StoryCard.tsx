
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Trash2, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


type Story = {
    _id: string
    title: string
    description: string
    image: string
    author: string
    categories: string[]
    readingTime: string
    location: string
    language: string
}
const StoryCard = ({
    story,
    onRemove,
    type,
}: {
    story: Story
    onRemove: (id: string) => void
    type: "bookmark" | "like"
}) => (
    <Card className="h-full border-none shadow-md flex flex-col justify-between">
        <div>
            <div className="relative h-48 w-full">
                <Image src={story.image || "/placeholder.svg"} alt={story.title} fill className="object-cover rounded-t-lg" />
                <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md">
                    {type === "bookmark" ? (
                        <Bookmark className="h-4 w-4 text-primary" />
                    ) : (
                        <Heart className="h-4 w-4 text-rose-500" />
                    )}
                </div>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl">{story.title}</CardTitle>
                <CardDescription>by {story.author}</CardDescription>
            </CardHeader>
        </div>
        <CardFooter className="flex justify-between gap-2 mt-4">
            <Link href={`/stories-details/${story._id}`}>
                <Button
                    variant="secondary"
                    size="sm"
                    className={
                        type === "like"
                            ? "bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 dark:text-rose-300"
                            : ""
                    }
                >
                    Read Story
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(story._id)}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
            </Button>
        </CardFooter>
    </Card>
)

export default StoryCard