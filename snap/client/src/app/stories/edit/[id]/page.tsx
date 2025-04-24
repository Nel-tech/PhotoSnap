// 'use client'
// import Nav from "@/components/Nav";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { X, Clock, MapPin, Globe } from "lucide-react";
// import { useForm, Controller } from "react-hook-form";
// import { useMutation } from "@tanstack/react-query";
// import cookie from "js-cookie";
// import axios from "axios";
// import toast from "react-hot-toast";

// function EditStory() {
//   return (
//       <div className="max-w-3xl mx-auto py-8">
//           <h1 className="text-3xl font-bold text-center mb-8">Upload a Story</h1>
//           <form onSubmit={handleSubmit(onSubmit)}>
//               <Card className="border-none lg:border lg:border-black">
//                   <CardHeader>
//                       <CardTitle>Story Details</CardTitle>
//                       <CardDescription>Share your story with the community.</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                       {/* Title */}
//                       <div>
//                           <Label className="mb-2">Title </Label>
//                           <Input
//                               placeholder="Story title"
//                               className="border-[2px] border-gray-400 focus:border-[1px] focus:border-gray-300 focus:ring-0 focus:outline-none"
//                               {...register("title", { required: "Title is required" })}
//                           />

//                           {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                       </div>

//                       {/* Description */}
//                       <div>
//                           <Label className="mb-2">Description </Label>
//                           <Textarea placeholder="Short description" {...register("description", { required: "Description is required" })} />
//                           {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//                       </div>

//                       {/* Image */}
//                       <div>
//                           <Label className="mb-2">Image </Label>
//                           {imagePreview && (
//                               <div className="relative mb-4">
//                                   <img src={imagePreview} alt="Preview" className="max-h-64 rounded" />
//                                   <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>
//                                       <X className="h-4 w-4" />
//                                   </Button>
//                               </div>
//                           )}
//                           <Input
//                               type="file"
//                               accept="image/*"
//                               {...register("image", { required: "Image is required" })}
//                               onChange={(e) => {
//                                   register("image").onChange(e);
//                                   handleImageChange(e);
//                               }}
//                           />
//                           {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
//                       </div>

//                       {/* Author */}
//                       <div>
//                           <Label className="mb-2">Author</Label>
//                           <Input placeholder="Author name" {...register("author", { required: "Author is required" })} />
//                           {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
//                       </div>

//                       {/* Category & Reading Time */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                               <Label className="mb-2">Category </Label>
//                               <Input placeholder="e.g. Fiction, History" {...register("categories", { required: "Category is required" })} />
//                               {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
//                           </div>

//                           <div>
//                               <Label className="flex gap-2 items-center mb-2"><Clock className="h-4 w-4" /> Estimated Reading Time</Label>
//                               <Controller
//                                   name="estimatedReadingTime"
//                                   control={control}
//                                   rules={{ required: "Estimated reading time is required" }}
//                                   render={({ field }) => (
//                                       <Select onValueChange={field.onChange} value={field.value}>
//                                           <SelectTrigger>
//                                               <SelectValue placeholder="Select..." />
//                                           </SelectTrigger>
//                                           <SelectContent>
//                                               <SelectItem value="Under 5 minutes">Under 5 minutes</SelectItem>
//                                               <SelectItem value="5-10 minutes">5–10 minutes</SelectItem>
//                                               <SelectItem value="10-15 minutes">10–15 minutes</SelectItem>
//                                               <SelectItem value="15-30 minutes">15–30 minutes</SelectItem>
//                                               <SelectItem value="Over 30 minutes">Over 30 minutes</SelectItem>
//                                           </SelectContent>
//                                       </Select>
//                                   )}
//                               />
//                               {errors.estimatedReadingTime && <p className="text-red-500 text-sm">{errors.estimatedReadingTime.message}</p>}
//                           </div>
//                       </div>

//                       {/* Location & Language */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <div>
//                               <Label className="flex gap-2 items-center  mb-2"><MapPin className="h-4 w-4" /> Location</Label>
//                               <Input placeholder="Story location" {...register("location", { required: "Location is required" })} />
//                               {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
//                           </div>

//                           <div>
//                               <Label className="flex gap-2 items-center mb-2"><Globe className="h-4 w-4" /> Language</Label>
//                               <Controller
//                                   name="language"
//                                   control={control}
//                                   rules={{ required: "Language is required" }}
//                                   render={({ field }) => (
//                                       <Select onValueChange={field.onChange} value={field.value}>
//                                           <SelectTrigger>
//                                               <SelectValue placeholder="Select language" />
//                                           </SelectTrigger>
//                                           <SelectContent>
//                                               <SelectItem value="English">English</SelectItem>
//                                               <SelectItem value="French">French</SelectItem>
//                                               <SelectItem value="Spanish">Spanish</SelectItem>
//                                           </SelectContent>
//                                       </Select>
//                                   )}
//                               />
//                               {errors.language && <p className="text-red-500 text-sm">{errors.language.message}</p>}
//                           </div>
//                       </div>

//                       {/* Tags */}
//                       <div>
//                           <Label className="mb-2">Tags</Label>
//                           <div className="flex items-center gap-2">
//                               <Input
//                                   placeholder="Add a tag"
//                                   value={inputTag}
//                                   onChange={(e) => setInputTag(e.target.value)}
//                                   onKeyDown={handleKeyDown}
//                               />
//                               <Button type="button" onClick={handleAddTag}>Add</Button>
//                           </div>
//                           <div className="flex flex-wrap mt-2 gap-2">
//                               {(getValues("tags") || []).map((tag, index) => (
//                                   <Badge key={index} className="flex items-center gap-1">
//                                       {tag}
//                                       <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
//                                   </Badge>
//                               ))}
//                           </div>
//                       </div>


//                   </CardContent>

//                   <CardFooter className="justify-end">
//                       <Button type="submit" disabled={isPending}>
//                           {isPending ? "Uploading..." : "Submit Story"}
//                       </Button>
//                   </CardFooter>
//               </Card>
//           </form>
//       </div>
//   )
// }

// export default EditStory