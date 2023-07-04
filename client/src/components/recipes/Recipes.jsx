import "./recipes.css";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { userContext } from "../../userContext";
import {
  ThumbDownOffAlt,
  ThumbUpOffAlt,
  ThumbDownSharp,
  ThumbUpSharp,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function Recipes({ recipe, setClicked }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [like, setLike] = useState(recipe.likes.length);
  const [dislike, setDisLike] = useState(recipe.dislikes.length);
  const { userInfo } = useContext(userContext);
  const navigate = useNavigate();
  const navigateTo = (route) => {
    navigate(route);
  };

  useEffect(() => {
    setIsLiked(recipe.likes.includes(userInfo?._id));
  }, [userInfo?._id, recipe.likes]);

  useEffect(() => {
    setIsDisLiked(recipe.dislikes.includes(userInfo?._id));
  }, [userInfo?._id, recipe.dislikes]);

  const likeHandler = () => {
    if (userInfo?._id) {
      try {
        axios
          .put("/recipes/" + recipe._id + "/like", { userId: userInfo._id })
          .then((res) => {
            setClicked((click) => !click);
          });
      } catch (err) {
        console.log(err);
      }
      setLike(isLiked ? like - 1 : like + 1);
      setDisLike(recipe.dislikes.length);
      setIsDisLiked(false);
      setIsLiked(!isLiked);
    }
  };
  const dislikeHandler = () => {
    if (userInfo?._id) {
      try {
        axios
          .put("/recipes/" + recipe._id + "/dislike", {
            userId: userInfo._id,
          })
          .then((res) => {
            setClicked((click) => !click);
            console.log(setClicked);
          });
      } catch (err) {
        console.log(err);
      }
      setDisLike(isDisLiked ? dislike - 1 : dislike + 1);
      setLike(recipe.likes.length);
      setIsLiked(false);
      setIsDisLiked(!isDisLiked);
    }
  };

  return (
    <div className="singleRecipe">
      <div className="singleRecipeLeft">
        <div className="recipeImgConatiner">
          <img
            src={"/images/recipe/" + recipe?.picture}
            alt={recipe.title}
            className="recipeImg"
          />
        </div>
        <div className="recipeLikeConatiner">
          {isLiked ? (
            <ThumbUpSharp className="like" onClick={likeHandler} />
          ) : (
            <ThumbUpOffAlt className="like" onClick={likeHandler} />
          )}
          <div className="likeNumber">{like}</div>

          {isDisLiked ? (
            <ThumbDownSharp className="like" onClick={dislikeHandler} />
          ) : (
            <ThumbDownOffAlt className="like" onClick={dislikeHandler} />
          )}
          <div className="likeNumber">{dislike}</div>
        </div>
      </div>
      <div className="singleRecipeRight">
        <h3 className="singleRecipeTitle">
          Name :
          <span
            className="singleRecipeTitleText"
            onClick={() => {
              navigateTo(`/recipe/${recipe._id}`);
            }}
          >
            {" "}
            {recipe.title}
          </span>
        </h3>
        <h3 className="singleRecipeAuthor">
          Author:
          <span className="singleRecipeAuthorText">{recipe.userId}</span>
        </h3>
        <div className="singleRecipeDescConatiner">
          <h3 className="singleRecipeDesc">Description</h3>
          <p className="singleRecipeDescText">
            {recipe.desc.slice(0, 130)} ...
          </p>
        </div>
      </div>
    </div>
  );
}
