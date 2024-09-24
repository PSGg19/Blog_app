import React, { useEffect } from "react";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  // Local state management
  const [file, setFile] = useState(null); // To hold the selected file
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Track image upload progress
  const [imageUploadError, setImageUploadError] = useState(null); // Store image upload errors
  const [formData, setFormData] = useState({}); // Store form data
  const [publishError, setPublishError] = useState(null); // To store any publish errors

  // Use navigate and params from React Router
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store

  // Fetch the post details when the component loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        
        if (!res.ok) {
          setPublishError(data.message); // Show error if fetch fails
          return;
        }

        // Populate the form data if post is found
        if (res.ok) {
          setPublishError(null); // Clear previous errors
          setFormData(data.posts[0]); // Populate form with post details
        }
      } catch (error) {
        console.log(error.message);
        setPublishError("Failed to fetch post");
      }
    };
    fetchPost();
  }, [postId]); // Dependency array ensures this runs when postId changes

  // Handle image file upload to Firebase Storage
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }

    setImageUploadError(null); // Clear any previous errors

    try {
      const storage = getStorage(app); // Get Firebase storage instance
      const fileName = new Date().getTime() + "-" + file.name; // Generate unique file name
      const storageRef = ref(storage, fileName); // Reference to storage location
      const uploadTask = uploadBytesResumable(storageRef, file); // Upload file task

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0)); // Update progress
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null); // Reset progress on error
        },
        () => {
          // On successful upload, get download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null); // Clear progress
            setImageUploadError(null); // Clear error
            setFormData({ ...formData, image: downloadURL }); // Update form with image URL
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null); // Reset progress on error
      console.log(error);
    }
  };

  // Handle form submission for updating the post
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the form data to the backend
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message); // Display error if update fails
        return;
      }

      // On successful update, navigate to the updated post
      if (res.ok) {
        setPublishError(null); // Clear errors
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong during the update.");
    }
  };

  console.log(formData); // Log form data for debugging

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Title and Category inputs */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title}
          />
          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">ReactJs</option>
            <option value="python">Python</option>
            <option value="web-development">Web-Development</option>
            <option value="nextjs">NextJs</option>
          </Select>
        </div>

        {/* File input for image upload */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16 ">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {/* Show any upload error */}
        {imageUploadError && (
          <div>
            <Alert color="red">{imageUploadError}</Alert>
          </div>
        )}

        {/* Display uploaded image */}
        {formData.image && (
          <img src={formData.image} alt="upload" className="w-72 h-72 " />
        )}

        {/* Rich text editor for post content */}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write Something..."
          className="h-72 mb-12"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        {/* Submit button for the form */}
        <Button gradientDuoTone="purpleToPink" type="submit">
          Update
        </Button>

        {/* Display any errors related to publishing the post */}
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
