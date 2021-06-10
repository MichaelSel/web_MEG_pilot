


var run_block = function (subject_id,block_no = 1,callback,sona="",quiz_questions, total_blocks=10) {
    /* global vars */
    base_dir = "/pubstore"
    sub_dir = base_dir + "/" + subject_id
    img_dir = sub_dir + "/images"
    audio_dir = sub_dir + "/audio"
    csv_dir = sub_dir + "/csv"
    ITI_dur = 1000
    question_csv = undefined
    var mapping_1st2nd = {
        "A":{rating: "1st", certainty:"high"},
        "G":{rating: "neither", certainty:"high"},
        "L":{rating: "2nd", certainty:"high"}
    }
    var mapping_yesno = {
        "Y":{rating: true, certainty:"high"},
        "N":{rating: false, certainty:"high"}
    }

    const execute_block = function (json) {
        /* create timeline */
        var timeline = [];

        var on_screen_prompts = []


        /* define welcome message trial */
        var welcome = {
            type: "html-keyboard-response",
            stimulus: "<p> Hello and welcome to the study.<br> <br>" +
                "<p>Press any key on your keyboard to continue.</p>",
            data: { name: 'welcome_message' }
        };

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'><b>NOTE: If you had participated in one of our previous experiments (e.g. Music Discrimination): this is a separate experiment and has a new set of instructions. Please read carefully.</b></p><br><br>" +
                "<p class='p_30'>Press the [A] key on your keyboard to continue.</p>",
            choices: ['a'],

            data: { name: 'message' }
        })

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>At this time, please attempt to eliminate any potential distractions.<br>" +
                "We ask that you please provide us with your undivided attention during the experiment.</p>" +
                "<p class='p_30'>Your responses are evaluated throughout the task on particular trials. Low engagement on these trials may result in more test questions.</p>" +
                "<p class='p_30'>The results of this study depend on your engagement. If you feel tired or unfocused, please hold off on performing the experiment at this time.</p>" +
                "<p class='p_30'>Press the [N] key on your keyboard to continue.</p>",
            choices: ['n'],
            data: { name: 'message' }
        })

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>In order to take this experiment you must use headphones.<br>" +
                "Please connect your headphones now if they are not already connected. <br>" +
                "When you are ready, press any key to continue.<br><br>" +
                "If you do not have headphones you may use earphones. Otherwise, unfortunately you cannot participate in this experiment at this time.<br> " +
                "We thank you for you time and your willingness to help. </p>",
            data: { name: 'headphones message' }
        })


        var instructions_practice = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>For every trial you will listen to a (\"test\") melody. <br>" +
                "This melody will be followed by two similar (\"comparison\") melodies <br>(Option 1 and Option 2).</p>" +
                "<p class='p_30'>Press the [T] key on your keyboard to continue.</p>",
            post_trial_gap: 0,
            choices: ['t'],
            data: { name: 'instructions_practice' }
        };

        var instructions_practice2 = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>After listening to the melodies, you will be asked to pick one of the two comparison melodies that (in your " +
                "opinion) sounds most <b>DIFFERENT</b> than the original test melody.</p>" +
                "<p class='p_30'>If you think Option 1 was <b>more different</b> than the test melody, please press [A] on your keyboard. " +
                "Otherwise, if you think Option 2 was <b>more different</b> than the test, please press [L] on your keyboard.</p>" +
                "<p class='p_30'>Press the [C] key on your keyboard to continue.</p>",
            choices: ['c'],
            post_trial_gap: 0,
            data: { name: 'instructions_practice' }
        };



        var instructions_practice3 = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>The melodies are very brief so we ask that you focus your attention and try to listen to the melody as closely as possible.</p>" +
                "<p class='p_30'>Press the [F] key on your keyboard to continue.</p>",
            post_trial_gap: 0,
            choices: ['f'],
            data: { name: 'instructions_practice' }
        };

        on_screen_prompts.push(instructions_practice)

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>The keyboard instructions will appear on the screen throughout the experiment.</p>" +
                "<p class='p_30'>Please pay attention to the cross at the center of the screen throughout the task.</p>" +
                "<p class='p_30'>In total, this experiment takes about an hour to complete.</p>" +
                "<p class='p_30'>The melodies are very brief so we ask that you focus your attention and try to listen to the melody as closely as possible.</p>" +
                "<p class='p_30'>Press any key to begin.</p>",
            post_trial_gap: 0,
            data: { name: 'message' }
        })


        var instructions_trial = {
            type: "html-keyboard-response",
            stimulus: "<p>Experimental Session, block " + block_no + " of " + total_blocks + ".</p>" +
                "" +
                "<p>Press any key to begin.</p>",
            post_trial_gap: 0,
            data: { name: 'instructions_trial' }

        };
        /* test trials */
        var fixation = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:60px;">+</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: ITI_dur,
            data: { name: 'fixation_cross' },
            post_trial_gap: 0,
        }
        var countdown_1 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:60px;">1...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var countdown_2 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:60px;">2...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var countdown_3 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:60px;">3...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var procedure = []
        for(let ind in json) {

            let Q = json[ind]
            var audio_probe = {
                type: 'audio-keyboard-response',
                stimulus: audio_dir + "/" + Q.probe_file,
                trial_ends_after_audio:true,
                response_ends_trial: false,
                choices: [],
                prompt: "<p id='fixation_guy' style='color:blue;font-size: 60px'>Test Melody</p>" +
                    "<br><br><br><br>" +
                    "<div style='width: 800px'>" +
                    "</div>",
                data: { name: 'probe' },
            };
            var audio_option1 = {
                type: 'audio-keyboard-response',
                stimulus:  audio_dir+ "/" +Q.option1_file,
                trial_ends_after_audio:true,
                response_ends_trial: false,
                choices: [],
                prompt: "<p id='fixation_guy' style='color:green;font-size: 60px'>Option 1</p>" +
                    "<br><br><br><br>" +
                    "<div style='width: 800px'>" +
                    "</div>",
                data: { name: 'option1' },
            };

            var audio_option2 = {
                type: 'audio-keyboard-response',
                stimulus:  audio_dir+ "/" +Q.option2_file,
                trial_ends_after_audio:true,
                response_ends_trial: false,
                choices: [],
                prompt: "<p id='fixation_guy' style='color:green;font-size: 60px'>Option 2</p>" +
                    "<br><br><br><br>" +
                    "<div style='width: 800px'>" +
                    "</div>",
                data: { name: 'option2' },
            };
            var choice_screen = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px;line-height: 1.4em;'>Which of the two comparison melodies (Option 1 or Option 2) sounded more <b>DIFFERENT</b> than the test melody?</p><br><br><br><br><br>" +
                    "<div style='width: 100%'>" +
                    "<div style='float: left;width: 300px; font-size: 25px;line-height: 1.4em;'>[A] Option 1 was more <b>different</b></div>" +
                    "<div style='float: right; width:300px;font-size: 25px;line-height: 1.4em;'>[L] Option 2 was more <b>different</b></div>" +
                    "<div style='margin:0 auto; width:300px;font-size: 25px;line-height: 1.4em;'>[G] I was unable to pay attention or could not hear a difference between the comparison melodies</div></div>" +
                    "</div>" +
                "",
                choices: ['a','l','g'],
                data: { name: 'choice' },
                on_finish: function(data){
                    data.response = mapping_1st2nd[String.fromCharCode(data.key_press)].rating
                    data.certainty = mapping_1st2nd[String.fromCharCode(data.key_press)].certainty
                    data.char = String.fromCharCode(data.key_press)
                    data.set = Q.set
                    data.transposition = Q.transposition
                    data.order = Q.order
                    data.mode = Q.mode
                    data.mode_num = Q.mode_num
                    data.shift_amount = Q.shift_amount
                    data.shift_position = Q.shift_position
                    data.probe_pitches = Q.probe
                    data.shifted_pitches = Q.shifted
                    data.swapped_pitches = Q.swapped
                    data.shift_direction = Q.shift_dir
                    data.question_num = parseInt(ind+1)
                    data.stimulus="[A] option 1, [L] option 2, [G] neither"
                    data.has_decoy = Q.has_decoy
                    if(data.has_decoy) data.decoy_position = Q.decoy_position
                }
            }


            var questions_left_after_practice = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px'>Practice is now over and the experiment will begin (following the same structure as the practice session).<br><br>Section " + block_no +", Question" + parseInt(parseInt(ind)+1) + "/" + json.length + "</p>" +
                    "<br><p>Press any key to hear the test melody and the two comparison melodies.</p>",
                data: { name: 'interquestion screen' },
            }


            let section_name
            if(block_no==0) section_name = '"practice"'
            else section_name = block_no
            var questions_left = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px'>Section " + section_name +", Question " + parseInt(parseInt(ind)+1) + "/" + json.length + "</p>" +
                    "<br><p>Press any key to hear the test melody and the two comparison melodies.</p>",
                data: { name: 'interquestion screen' },
            }

            procedure.push(questions_left)
            procedure.push(countdown_3)
            procedure.push(countdown_2)
            procedure.push(countdown_1)
            procedure.push(audio_probe)
            procedure.push(fixation)
            procedure.push(audio_option1)
            procedure.push(fixation)
            procedure.push(audio_option2)

            procedure.push(choice_screen)
            procedure.push(fixation)


        }

        var quiz = []
        for (let question of quiz_questions) {
            var quiz_Q = {
                type: "html-keyboard-response",
                stimulus: "<p>Please indicate true or false:<br>" + question[0] + "</p>" +
                    "" +
                    "<div style='width: 100%'>" +
                    "<div style='float: left;width: 300px; font-size: 25px;line-height: 1.4em;'>[Y] True</div>" +
                    "<div style='float: right; width:300px;font-size: 25px;line-height: 1.4em;'>[N] False</div></div>",
                post_trial_gap: 0,
                choices: ['y','n'],
                data: { name: 'quiz' },
                on_finish: function (data) {

                    data.response = mapping_yesno[String.fromCharCode(data.key_press)].rating
                    data.certainty = mapping_yesno[String.fromCharCode(data.key_press)].certainty
                    if(data.response==question[1]) data.correct = true
                    else data.correct = false
                }

            }
            quiz.push(quiz_Q)
            quiz.push(fixation)
        }

        var show_score = {
            score: 0,
            totalQ: 0,
            type: "html-keyboard-response",
            stimulus: function () {
                let total_q = 0
                let Qscore = 0
                let resps = jsPsych.data.get().filter({name:"quiz"}).values()
                resps.forEach((resp) => {
                    total_q++
                    if(resp.correct) Qscore++
                })
                return "<p>You got " + Qscore  +" of " + total_q + " correct.</p>" +
                    "" +
                    "<p>Press any key to continue.</p>"
            },
            post_trial_gap: 0,
            data: { name: 'show_score' },
            on_finish: function (data) {
                let total_q = 0
                let Qscore = 0
                let resps = jsPsych.data.get().filter({name:"quiz"}).values()
                resps.forEach((resp) => {
                    total_q++
                    if(resp.correct) Qscore++
                })
                data.score = Qscore/total_q
            }


        };
        quiz.push(show_score)

        var final_message_practice = {type: "html-keyboard-response",
            stimulus: "<p>Practice is now over and the experiment will begin (following the same structure as the practice session).</p>" +
                "<p>You may now rest, and when you are ready,<br>" +
                "Press any key to continue.</p>",
            post_trial_gap: 0,
            data: { name: 'final_message' }
        }

        var final_message = {type: "html-keyboard-response",
            stimulus: "<p>You have finished the block.</p>" +
                "<p>You may now rest, and when you are ready,<br>" +
                "Press any key to continue.</p>",
            post_trial_gap: 0,
            data: { name: 'final_message' }
        }

        if(block_no==1) {
            let fullscreen = {
                type: 'fullscreen',
                    fullscreen_mode: true
            }
            timeline.push(welcome,fullscreen,...on_screen_prompts,...procedure,final_message);
            // timeline.push(welcome,fullscreen,headphones,instructions_practice,...procedure,...quiz,final_message_practice);

        } else {
            timeline.push(instructions_trial,...procedure,final_message);

        }

        var save_all_json = function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'save'); // 'write_data.php' is the path to the php file described above.
            xhr.setRequestHeader('Content-Type', 'application/json');
            // data = jsPsych.data.get().json()
            data = jsPsych.data.get().filter({name:"choice"})
            let quiz = jsPsych.data.get().filter({name:"show_score"})
            data = data.join(quiz)
            data = data.json()
            xhr.send(JSON.stringify({subject: subject_id, data: data, block: block_no}));
            xhr.onerror = function() { // only triggers if the request couldn't be made at all
                alert(`Network Error. Will try again in 5 seconds.`);
                setTimeout(save_all_json,5000)
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if(xhr.status==200) {
                        console.log("saved")
                        callback()
                    }
                }
            }

        }
        var save_chunk = function (chunk_name) {
            //do nothing. Maybe write it later



        }
        jsPsych.save_all_json = save_all_json

        /* start the experiment */
        jsPsych.init({
            timeline: timeline,
            default_iti: 0,
            exclusions: {
                audio: true
            },
            on_finish: function() {
                jsPsych.data.addProperties({
                    subject: subject_id,
                    sona:sona,
                    block: block_no,
                    time: new Date()
                });
                save_all_json(callback)
            }
        });
    }

    /*get block data*/
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                execute_block(JSON.parse(xmlhttp.responseText))
            }
            else alert('There seems to be an error');
        }
    };
    xmlhttp.open("GET", csv_dir + "/block_" +block_no + ".json", true);
    xmlhttp.send();

}
