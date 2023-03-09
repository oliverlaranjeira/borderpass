import React, { useState } from 'react';
import styles from "./Questions.module.css";
import axios from 'axios';
import { Button, TextField, Container, Select, MenuItem, RadioGroup, FormControlLabel, FormControl, Radio } from '@material-ui/core';
import { CssBaseline } from '@mui/material';
import Rating from '@mui/material/Rating';
import Pagination from '@mui/material/Pagination';


// mock API on Postman
const URL = 'https://0867d4da-e4fe-4a25-99a9-f48d0a1e5b97.mock.pstmn.io/accept'

const Questions = ({ questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // set array of answers to all be null at the start
    const [answers, setAnswers] = useState(Array.from({length: questions.length}, () => null));
    const [isFormValidBool, setIsFormValidBool] = useState(false);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = answer;
        setAnswers(newAnswers);
        setIsFormValidBool(isFormValid(newAnswers));
    };

    const handlePage = (e, page) => {
        setCurrentIndex(page - 1);
    }

    function isFormValid(new_answers) {
        // sees if all questions that are required have been filled in
        for (const question of questions){
            if(question.required && new_answers[question.id - 1] == null){
                return false;
            }
        }
        return true;
    };

    const [error, setError] = useState("");

    const [errorMessage, setErrorMessage] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // checks is all required questions have been filled out - if not, then early return and do nothing
        if (!isFormValidBool){
            return;
        }
        
        // send answer to API
        axios
          .post(URL, e.answers, {
            headers: {
              'Content-Type': 'multipart/form-data'  
            }
          })
          .then((response) => {
            if (response.status === 200) {
              // do something, success 
              alert("Nice! Good job");
              alert(answers)
            }
          })
          .catch((err) => {
            setError(true);
            setErrorMessage(err.response);
            alert("Not good!")
            return false;
          });
    }

    const currQuestion = questions[currentIndex];

    return(
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
            <CssBaseline />
            <Container className={styles["container"]} disableGutters={true}>
                <h1 className={styles["question-number"]}>Question #{currentIndex + 1}</h1>
                <h2 className={styles["question-content"]}>
                    {currQuestion.question} 
                    {/* add asterisk if question is required */}
                    {currQuestion.required ? <span className={styles["required"]}>*</span> : null}
                </h2>
                    {/* get question type and render accordingly */}

                    {/* text */}
                    {currQuestion.type === 'text' && (
                        <TextField
                        type="text"
                        // value is set to a pre-defined value or is set to null
                        value={answers[currentIndex] || ''} 
                        onChange={(e) => handleAnswer(e.target.value)}
                        required={currQuestion.required}
                        >
                        </TextField>
                    )}

                    {/* dropdown list */}
                    {currQuestion.type === 'dropdown' && (
                        <Select
                        value={answers[currentIndex] || ''}
                        onChange={(e) => handleAnswer(e.target.value)}
                        required={currQuestion.required}
                        >
                            {/* loops over all options provided in json, make them a potential value */}
                            {currQuestion.options.map((option) => (
                                // sets up unique key value combination
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                    
                    {/* radio button */}
                    {currQuestion.type === 'radio' && (
                        <FormControl>
                            {/* loops over all options provided in json, makes them a potential value */}
                            {currQuestion.options.map(option => (
                                // sets up unique key value combination
                                <RadioGroup row key={option.value}>
                                    <FormControlLabel
                                    value={option.value}
                                    control={<Radio />}
                                    // sets if radio button was checked or not, macthes it with previously checked answer if re-rendered
                                    checked={answers[currentIndex] === option.value}
                                    onChange={e => handleAnswer(e.target.value)}
                                    required={currQuestion.required}
                                    />
                                    {option.label}
                                </RadioGroup>
                            ))}
                      </FormControl>
                    )}


                    {/* file upload */}
                    {currQuestion.type === 'file' && (
                        <div>
                            <input
                                accept="image/*"
                                type="file"
                                id="select-image"
                                style={{ display: 'none' }}
                                onChange={e => handleAnswer(e.target.files[0])}
                                required={currQuestion.required}
                            />
                            <label htmlFor="select-image"> 
                                <Button variant='contained' component="span">
                                    Upload Image
                                </Button>
                            </label>
                        </div>
                        
                    )}

                    {/* ratings */}
                    {currQuestion.type === 'rating' && (
                    <Rating
                        onChange={e => handleAnswer(e.target.value)}
                        required={currQuestion.required}
                    />
                    )}

                    {/* Submit is disabled until all required questions have an answer */}
                    <Button className={styles["submit"]} variant="outlined" disabled={!isFormValidBool} onClick={handleSubmit}>Submit</Button>
                    
                    <Pagination className={styles["pagination"]} count={questions.length} onChange={handlePage}/>

                    {error? <ul> {errorMessage.map((value)=>(<li>{value} </li>))} </ul>: null}
            </Container>
        </form>
    );
};

export default Questions;