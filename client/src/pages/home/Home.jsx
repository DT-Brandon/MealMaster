import Topbar from "../../components/topbar/Topbar";
import { useState, useEffect } from "react";
import "./home.css";
import Footer from "../../components/footer/Footer";
import Recipes from "../../components/recipes/Recipes";

import axios from "axios";

export default function Home() {
  /* const [show, setShow] = useState(false); */

  const [recipesList, setRecipesList] = useState([]);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    axios.get("/recipes/user/all").then((res) => {
      setRecipesList(res.data);
    });
    // eslint-disable-next-line
  }, [clicked]);

  const recipeComponents = recipesList.map((recipe) => {
    return <Recipes key={recipe._id} recipe={recipe} setClicked={setClicked} />;
  });

  /*  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); */
  return (
    <div>
      <Topbar />
      <div className="homeContainer"></div>
      {/*  <div className="RegisterModal">
        {show && <Registration setClose={handleClose} />}
      </div> */}
      <div className="content">
        <div className="homeSubTitle">
          <h2>The recipes you should try </h2>
          <h2>{clicked === false ? "true" : "false"}</h2>
        </div>
        <div className="recipesContainer">{recipeComponents}</div>
      </div>
      <Footer />
    </div>
  );
}
