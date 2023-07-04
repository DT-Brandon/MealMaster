import React, { useEffect, useState, useRef, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";
import "./recipe.css";
import { userContext } from "../../userContext";
import { useParams } from "react-router";
import {
  ThumbDownOffAlt,
  ThumbUpOffAlt,
  ThumbDownSharp,
  ThumbUpSharp,
} from "@mui/icons-material";
import axios from "axios";

export default function Recipe() {
  const params = useParams();
  const [recipe, setRecipe] = useState();

  const comment = useRef();

  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [like, setLike] = useState();
  const [dislike, setDisLike] = useState();
  const { userInfo } = useContext(userContext);
  useEffect(() => {
    try {
      axios.get(`/recipes/${params.recipeId}`).then((res) => {
        setRecipe(res.data);
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [like, dislike]);
  useEffect(() => {
    setIsLiked(recipe?.likes.includes(userInfo?._id));
    setLike(recipe?.likes.length);
  }, [userInfo?._id, recipe?.likes]);

  useEffect(() => {
    setIsDisLiked(recipe?.dislikes.includes(userInfo?._id));
    setDisLike(recipe?.dislikes.length);
  }, [userInfo?._id, recipe?.dislikes]);
  const likeHandler = () => {
    if (userInfo?._id) {
      try {
        axios.put("/recipes/" + recipe._id + "/like", { userId: userInfo._id });
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
        axios.put("/recipes/" + recipe._id + "/dislike", {
          userId: userInfo._id,
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

  let i = 1;

  const ingredientComponent = recipe?.ingredients.map((ingredient) => {
    const newIngredient = (
      <div key={ingredient + i} className="ingredient">
        <span className="step"> {i}) </span> {ingredient}
      </div>
    );
    i++;
    return newIngredient;
  });

  i = 1;
  const directionComponent = recipe?.directions.map((step) => {
    const newStep = (
      <div key={step + i} className="direction">
        <span className="step">step {i}: </span> {step}
      </div>
    );
    i++;
    return newStep;
  });
  i = 1;

  const commentComponent = recipe?.comments.map((comment) => {
    const newComment = (
      <div key={comment.userId + i} className="comment">
        <span className="step"> </span> {comment.comment}
      </div>
    );
    i++;
    return newComment;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      userId: userInfo._id,
      comment: comment.current.value,
    };
    try {
      axios.put("/recipes/" + recipe._id + "/comment", data).then(
        setRecipe((prevRecipe) => {
          const commentList = recipe?.comments;
          commentList.push(data);
          return { ...prevRecipe, comments: commentList };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Topbar />
      <div className="showRecipeWrapper">
        <div className="showRecipeContainer">
          <h2>
            Name: <span className="showRecipeName">{recipe?.title}</span>
          </h2>
          <div className="recipeLikeConatiner">
            {isLiked ? (
              <ThumbUpSharp className="like" onClick={likeHandler} />
            ) : (
              <ThumbUpOffAlt className="like" onClick={likeHandler} />
            )}
            <span className="likeValue">{like}</span>
            {isDisLiked ? (
              <ThumbDownSharp className="like" onClick={dislikeHandler} />
            ) : (
              <ThumbDownOffAlt className="like" onClick={dislikeHandler} />
            )}
            <span className="likeValue">{dislike}</span>
          </div>
          <h2 className="showRecipeDescTitle">description</h2>
          <div className="showRecipeDescText">{recipe?.desc}</div>
          <h2>
            Author: <span className="showRecipeName">{recipe?.userId}</span>
          </h2>
          <div className="showRecipeImgConatiner">
            <img
              src={`/images/recipe/${recipe?.picture}`}
              alt=""
              className="showRecipeImg"
            />
          </div>
          <h2 className="showRecipePrepTime">
            Prep Time: {recipe?.preparationTime} mins
          </h2>
          <h2 className="showRecipePrepTime">
            servings: {recipe?.servings} person(s)
          </h2>
          {recipe?.cuisine !== "default" && (
            <h2 className="showRecipePrepTime">cuisine: {recipe?.cuisine}</h2>
          )}

          <h2 className="showRecipePrepTime">diet: {recipe?.diet}</h2>
          <h2 className="showRecipePrepTime">calories: {recipe?.calories}</h2>

          <h2 className="showRecipeIngredientTitle">Ingredients</h2>
          {ingredientComponent}
          <h2 className="showRecipeDirectionTitle">Direction</h2>
          {directionComponent}

          <form onSubmit={handleSubmit} className="addComment">
            <h2 className="showRecipeAddCommentTitle">add comments</h2>
            <div className="showRecipeCommentContainer">
              <textarea
                className="showRecipeComment"
                ref={comment}
                cols="30"
                rows="10"
              ></textarea>
              <input className="showRecipeSubmit" type="submit" value="Send" />
            </div>
          </form>
          <h2 className="showRecipeCommentTitle">Comments</h2>
          {commentComponent}
        </div>
      </div>

      <Footer />
    </div>
  );
}
