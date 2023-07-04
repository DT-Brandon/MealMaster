import React, { useState, useRef, useContext } from "react";
import Topbar from "../../components/topbar/Topbar";
import Footer from "../../components/footer/Footer";
import "./add.css";
import { userContext } from "../../userContext";
import axios from "axios";

export default function Add() {
  const [ingredientList, setIngredientList] = useState(3);
  const [directionList, setDirectionList] = useState(3);
  const [notesList, setNotesList] = useState(1);
  const { userInfo } = useContext(userContext);
  const cuisines = [
    "none",
    "african",
    "american",
    "british",
    "cajun",
    "caribbean",
    "chinese",
    "eastern european",
    "french",
    "german",
    "greek",
    "indian",
    "irish",
    "italian",
    "japanese",
    "jewish",
    "korean",
    "latin american",
    "mexican",
    "middle eastern",
    "nordic",
    "southern",
    "spanish",
    "thai",
    "vietnamese",
  ];
  const diet = [
    "none",
    "ketogenic",
    "paleo",
    "primal",
    "vegan",
    "vegetarian",
    "whole 30",
  ];
  const allergies = [
    {
      name: "dairy",
      check: false,
    },
    {
      name: "egg",
      check: false,
    },
    {
      name: "gluten",
      check: false,
    },
    {
      name: "grain",
      check: false,
    },
    {
      name: "peanut",
      check: false,
    },
    {
      name: "seafood",
      check: false,
    },
    {
      name: "sesame",
      check: false,
    },
    {
      name: "shellfish",
      check: false,
    },
    {
      name: "soy",
      check: false,
    },
    {
      name: "sulfite",
      check: false,
    },
    {
      name: "tree nut",
      check: false,
    },
    {
      name: "wheat",
      check: false,
    },
  ];

  const [ingerdientsValue, setIngredientValue] = useState([]);

  function handleIngredientChange(event) {
    const { name, value } = event.target;

    setIngredientValue((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  const ingredientInput = [];
  for (let i = 0; i < ingredientList; i++) {
    ingredientInput.push(
      <input
        type="text"
        className="addFormIngredients addFormInput"
        placeholder="Add your Ingredient"
        value={ingerdientsValue[i]}
        name={i}
        onChange={handleIngredientChange}
        required
      />
    );
  }
  const [directionsValue, setDirectionValue] = useState([]);

  function handleDirectionsChange(event) {
    const { name, value } = event.target;

    setDirectionValue((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  const directionsInput = [];
  for (let i = 0; i < directionList; i++) {
    directionsInput.push(
      <input
        type="text"
        className="addFormDirection addFormInput"
        placeholder="Add your steps"
        value={directionsValue[i]}
        name={i}
        onChange={handleDirectionsChange}
        required
      />
    );
  }
  const [notesValue, setNotesValue] = useState([]);

  function handleNotesChange(event) {
    const { name, value } = event.target;

    setNotesValue((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  const notesInput = [];
  for (let i = 0; i < notesList; i++) {
    notesInput.push(
      <input
        type="text"
        className="addFormNotes addFormInput"
        value={notesValue[i]}
        name={i}
        onChange={handleNotesChange}
        required
      />
    );
  }
  const cuisineSelectInput = cuisines.map((cuisine) => {
    return <option value={cuisine}>{cuisine}</option>;
  });
  const dietSelectInput = diet.map((diet) => {
    return <option value={diet}>{diet}</option>;
  });

  const [allergieValue, setAllergieValue] = useState(allergies);

  /* let allergieValue = allergies; */

  function handleAllergieChange(allergie) {
    setAllergieValue((prevData) => {
      return prevData.map((data) => {
        return data.name === allergie.name
          ? { name: data.name, check: !data.check }
          : data;
      });
    });

    /*  allergieValue = allergieValue.map((data) => {
      return data.name === allergie.name
        ? { name: data.name, check: !data.check }
        : data;
    }); */
  }

  const allergieInput = allergieValue.map((allergie) => {
    return (
      <div className="checkBoxGroup">
        <input
          type="checkbox"
          className="checkBox"
          onChange={() => {
            handleAllergieChange(allergie);
          }}
          name={allergie.name}
          id={allergie.name}
          checked={allergie.check}
        />
        <label htmlFor={allergie.name} className="checkBoxLabel">
          {allergie.name}
        </label>
      </div>
    );
  });

  const title = useRef();
  const description = useRef();
  const servings = useRef();
  const preparationTime = useRef();
  const dietType = useRef();
  const calories = useRef();
  const cuisine = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const ingredientArray = [];
    for (let i = 0; i < ingredientList; i++) {
      ingerdientsValue[i] && ingredientArray.push(ingerdientsValue[i]);
    }
    const dirArray = [];
    for (let i = 0; i < directionList; i++) {
      directionsValue[i] && dirArray.push(directionsValue[i]);
    }
    const notesArray = [];
    for (let i = 0; i < notesList; i++) {
      notesValue[i] && notesArray.push(notesValue[i]);
    }
    const IntolerancesArray = [];
    allergieValue.forEach((data) => {
      data.check && IntolerancesArray.push(data.name);
    });

    const Recipe = {
      title: title.current.value,
      userId: userInfo._id,
      desc: description.current.value,
      servings: servings.current.value,
      preparationTime: preparationTime.current.value,
      diet: dietType.current.value,
      calories: calories.current.value,
      notes: notesArray,
      ingredients: ingredientArray,
      directions: dirArray,
      intolerances: IntolerancesArray,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      Recipe.picture = fileName;

      try {
        await axios.post("/upload/recipe", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("/recipes/add", Recipe);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Add">
      <Topbar />
      <div className="addFormConatiner">
        <form className="addForm" onSubmit={submitHandler}>
          <h1 className="addFormTitle">Add A Recipe</h1>
          <span className="addFormLabel">Recipe Name (required)</span>
          <input
            type="text"
            className="addFormTitle addFormInput"
            ref={title}
            required
          />
          <span className="addFormLabel">Description (required)</span>
          <textarea
            required
            className="addFormInput addFormDesc"
            cols="90"
            rows="10"
            ref={description}
          ></textarea>
          <span className="addFormLabel">Picture (required)</span>
          <input
            type="file"
            className="addFormPictrue addFormInput"
            id="file"
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <span className="addFormLabelTitle">Ingredients (required)</span>
          <span className="addFormLabelInfo"> E.g 1 teaspoon sugar </span>
          {ingredientInput}
          <div>
            <span
              className="removeIngredient"
              onClick={() => {
                setIngredientList((list) => {
                  return list <= 0 ? list : list - 1;
                });
              }}
            >
              Remove
            </span>
            <span
              className="addIngredient"
              onClick={() => {
                setIngredientList((list) => list + 1);
              }}
            >
              Add
            </span>
          </div>
          <span className="addFormLabel">Directions(required)</span>
          {directionsInput}
          <div>
            <span
              className="removeIngredient"
              onClick={() => {
                setDirectionList((list) => {
                  return list <= 0 ? list : list - 1;
                });
              }}
            >
              Remove
            </span>
            <span
              className="addIngredient"
              onClick={() => {
                setDirectionList((list) => list + 1);
              }}
            >
              Add
            </span>
          </div>

          <span className="addFormLabel">Servings</span>
          <input
            type="number"
            className="addFormServings addFormInput"
            required
            ref={servings}
          />
          <span className="addFormLabel">Preparation Time (required)</span>
          <div>
            <input
              type="Number"
              className="addFormPrepTimeMins addFormInput"
              /* placeholder="Time In Minutes" */
              required
              ref={preparationTime}
            />
            <span className="preTime">Mins</span>
          </div>
          <span className="addFormLabel">Cuisine</span>
          <select className="addFormInput" ref={cuisine}>
            {cuisineSelectInput}
          </select>
          <span className="addFormLabel">Diet</span>
          <select className="addFormInput" ref={dietType}>
            {dietSelectInput}
          </select>

          <span className="addFormLabel">Calories</span>
          <input
            type="number"
            className="addFormCalories addFormInput"
            ref={calories}
          />
          <span className="addFormLabel">
            Does Your recipe conatine any of the following?
          </span>
          <div className="checkBoxContainer">{allergieInput}</div>

          <span className="addFormLabel">Add any usefull Notes and Tips</span>
          {notesInput}
          <div>
            <span
              className="removeIngredient"
              onClick={() => {
                setNotesList((list) => {
                  return list <= 0 ? list : list - 1;
                });
              }}
            >
              Remove
            </span>
            <span
              className="addIngredient"
              onClick={() => {
                setNotesList((list) => list + 1);
              }}
            >
              Add
            </span>
          </div>
          <button type="submit" className="addFormSubmit">
            Add Recipe
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
