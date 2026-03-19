import "./ImageGenerator.css";
import defaultImage from "../../Assets/default_image.svg";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ImageGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  let imageId = "";
  const element = useRef(null);
  const [image, setImage] = useState("/");
  const [errorAlert, setErrorAlert] = useState();
  async function createImage() {
    const inputValue = element.current.value;
    setIsLoading(true);
    const response = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "b96e12ba-a1b4-4072-b6cf-bc3ab8f9d534",
      },
      body: JSON.stringify({
        prompt: inputValue,
        params: {
          steps: 25,
          cfg_scale: 7.5,
          clip_skip: 1,
          width: 512,
          height: 512,
        },
        nsfw: false,
        censor_nsfw: true,
        r2: true,
        models: ["stable_diffusion"],
      }),
    });

    const data = await response.json();
    imageId = data.id;
    element.current.value='';
    getImage();
  }

  async function getImage() {
    setIsLoading(true);
    const timeOutId = setTimeout(async () => {
      const getImageById = await fetch(
        `https://aihorde.net/api/v2/generate/status/${imageId}`,
        { method: "GET" },
      );
      console.log(getImageById);
      if (getImageById.ok) {
        const responseOfgetImageById = await getImageById.json();
        if (responseOfgetImageById?.generations.length == 0) {
          setImage(defaultImage);
          setIsLoading(false);
          setErrorAlert(true);
        } else {
          setImage(responseOfgetImageById?.generations[0]?.img);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setImage(defaultImage);
        setErrorAlert(true);
      }
    }, 20000);

   
  }

  function closeAlert() {
    setErrorAlert(false);
  }

  return (
    <>
      <div className="container">
        <div className="header">
          <motion.h1
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, type: "tween" }}>
            Ai Image <span>Generator</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ x: -1000, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1, type: "tween" }}
          className="image-box">
          <motion.img
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            src={image == "/" ? defaultImage : image}
          />
          <div className="image-loading">
            <div
              className={
                isLoading ? `loading-bar-full` : `loading-hidden`
              }></div>
            <div
              className={
                isLoading ? "loading-text-visiable" : "loading-text-hidden"
              }>
              Loading...
            </div>
          </div>
        </motion.div>

        {errorAlert ? (
          <div className="error-alert">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <h4>Error</h4>
              <p>Failed to generate image. Please try again.</p>
            </div>
            <button
              className="error-close"
              onClick={() => {
                closeAlert();
              }}>
              ×
            </button>
          </div>
        ) : (
          ""
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1, type: "tween" }}
          className="image-search-box">
          <motion.input
            whileFocus={{ scale: 1 }}
            ref={element}
            type="text"
            placeholder="Describe What You Want...."
          />
          <motion.button
            whileTap={{ scale: 0.5 }}
            disabled={isLoading}
            transition={{ duration: 0.5, type: "tween" }}
            onClick={() => createImage()}>
            {
                isLoading ? ('loading...'):('Generate')


            }
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
