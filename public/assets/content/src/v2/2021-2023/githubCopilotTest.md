# Github Copilot Test

---

link: /Thingy_2022/githubCopilotTest/
tags: test, ai, copilot, github, generative ai
author: JaPNaA
shortDesc: Testing the capabilities of Github Copilot
timestamp: 2022-07-03T06:19:49Z
backgroundCSS: url(/Thingy_2022/githubCopilotTest/thumbnail.png)

---

\*Note: text crossed out are rejected texts from Copilot.

This is a ~~test of the Github Copilot.~~

This is a project created ~~by Github Copilot.~~

This is a project created to test Github Copilot.

I didn't know what project to test Github Copilot with, so I created this.

<small>Github Copilot is helping me write this README file too, however, it can't predict the English writing I want to write that well. (I guess writer's jobs will ~~be done by Github Copilot~~ not be replaced ~~by a human~~ by AI just yet.)</small>

On-the-spot, I decided on implementing a simple version of Flappy Bird, but I wanted to add a twist, so I added *rockets*.

## Thoughts of Github Copilot

### Good

- It saves time typing out stuff like removing an item from array:
```js
this.entities.splice(this.entities.indexOf(entity), 1);
```
- I think Copilot could be used as a substitute for copy-pasting code from StackOverflow.
    - You know those searches: 'how do I write a hello world program in {language}?'

### Bad

- It appears that it can only make suggestions based on text *before* the cursor. Therefore, it's not very good for editing code -- perhaps just creating it.
- It doesn't know about the other files -- you won't be getting suggestions to use classes defined in other files.
    - I feel there is great potential to first let the AI 'understand' the context, and then use the context to generate suggestions.
- It's very pattern-based. It'll ignore the current variable names and use variables names that seem to fit in the context.
    - However, it is making me more conscious of my variable names
    - Additionally, means Github Copilot won't solve any (unique) problems you'll encounter.
        - If you blindly trust the code, you'll end up with bugs (or weird code)
- One may not want to use Copilot because it's kind of distracting -- getting giant pieces of code suggested to you while you type.

### Highlight

I was about to go to sleep because 'ah a collision system -- I don't want to do that at 2:00', but then I decided to try and see if it could figure out the collision detection itself.

It wrote this entire thing (almost) by itself.

```js

// do collision detection //-- my comment
function doCollisionDetection() {
    for (const object of world.entities) {
        if (object instanceof Pipe) {
            if (bird.x + bird.width > object.x && bird.x < object.x + object.width) {
                if (bird.y + bird.height > object.y && bird.y < object.y + object.gapY) {
                    console.log("collision");
                    bird.remove();
                }
                //-- I wrote 'if'
                if (bird.y + bird.height > object.y + object.gapY + Pipe.gap && bird.y < object.y + object.gapY + Pipe.gap + object.height) {
                    console.log("collision");
                    bird.remove();
                }
            }
        }

        //-- I wrote if (object instanceof Pipe)
        if (object instanceof Rocket) {
            if (bird.x + bird.width > object.x && bird.x < object.x + object.width) {
                if (bird.y + bird.height > object.y && bird.y < object.y + object.height) {
                    console.log("collision");
                    bird.remove();
                }
            }
        }
    }
}
```

AND IT WORKS.

### Overall

Would I prefer using Github Copilot?

*Probably.* With enough 'practice', I should be able to understand where Github Copilot's strengths and weaknesses and maximize my productivity.

## Bonus: Copilot writes my cover letter

_I've recently been struggling to write cover letters, so I wanted to see how copilot handles it._

email: john.doe@mail.com
phone: +1-555-555-5555

Dear John Doe,

I am a software engineer at a company called **Company Name**. I am currently working on a project called **Project Name**.

You can find the code for the project [here](#). I am currently working on a **Github Copilot** project to help me write my README.md file. I am hoping to use Github Copilot to write my cover letter.

The Github Copilot is a tool that I am using to write my README.md file. It is a tool that I am using to write my cover letter.

My Github Copilot is a tool that I am using to write my cover letter. It is a tool that I am using to write my cover letter.

Please let me know if you have any questions.

Sincerely,

John Doe.

_This is a lot better than mine._ (I didn't complete mine yet.)
