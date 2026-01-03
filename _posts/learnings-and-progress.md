---
slug: "/post/learnings-and-progress"
date: "2023-04-30"
title: "Learnings and Progress"
---

I've still been working on a Deep Reinforcement Learning based game on and off for the past few years, and it's incredibly exciting how the ML landscape has evolved.

When I first started this project, OpenAI had only recently published its first papers on PPO and competitive self play. The basic abstractions of today's reinforcement learning landscape were still being built, and were hardly production grade. Python was also in the midst of its 2.7 -> 3.0 transition, and the ML community was split between reproducible research (that almost exclusively used 2.7) and new production frameworks (targeting 3.0+). 

Even tensorflow had its growing pains from TF1 -> TF2 while pytorch was in its infancy.

As the ML landscape has matured, so has the tooling around it; while 2020 may not have been an easy year to start this project, 2023 is shaping up to be a fantastic year to make progress.

## Industry Progress

### Battle Tested Abstractions

#### 1. Gym

[OpenAI Gym](https://github.com/openai/gym) proved to be a foundational starting point for Deep Learning frameworks, but it was never meant to be production grade software. It was developed primarily as a research tool, and with that motivation, had a slew of scalability issues that never were addressed. 

In late 2022, maintainance of the library was forked and moved to a [new home](https://farama.org/Announcing-The-Farama-Foundation), dubbed `gymnasium`. It was a drop-in replacement that the community adopted practically overnight, and made the development process pretty smooth compared to my experience in 2020.

#### 2. Stable Baselines 

Groundbreaking algorithms like PPO and SAC are the heart of this project, but I'm certainly not an expert enough to implement them from scratch. Projects like [Stable Baselines](https://stable-baselines.readthedocs.io/en/master/) provided a great starting point for many, containing premade RL algorithm implementations that could be quickly applied to your Gym environment. 

It too was caught in the crossfire between ML frameworks (tf1, torch, tf2) and python versions (2.7, 3.0), and eventually the library switched from tf1/py2 to torch/py3 in [Stable Baselines3](https://stable-baselines3.readthedocs.io/en/master/). This proved challenging for me initially, as many of the python 2 supported algorithms were faster than their torch supported counterparts. 

Over the years this library also stablized into a great research tool -- but what about production use cases?

#### 3. Ray + RLLib 

[Ray](ray.io) is both a python library for distributed workloads and a set of abstractions for deploying RL algorithms onto it. Functionally this meant there was better support for numerous parallel agents than there was in the past. I've gone through a few iterations of using this framework, and I'm certainly only at the tip of the iceburg in terms of its feature set. 

Concretely, it supports fantastic base classes for Multi Agent and Vectorized Environments which allowed me to switch my agent communication channels from one-socket-per-agent to one-socket-per-game, significantly cutting down on network overhead. In the future it also supports policy servers, which would let me dynamically scale up or scale down the number of environments over time.

## Project Progress

Now that we've established why this progress update took over two years, I'm proud to present the final result:

`twitch: six-legs-demo`

There's a lot to note here: 
1. This was trained in ~12 hours wall clock time on 32 concurrent agents in one game instance. I should be able to greatly increase the number of agents in the environment for faster sample collection in the future.
2. The reward function chosen was extremely simple and mainly adopted from this [research paper](https://arxiv.org/pdf/1506.02438.pdf). There's currently no penalty for overexertion or recurrance of actions which is why it's a bit shaky.
3. This skeleton's joints have 3 degrees of freedom each instead of 1 DoF Hinge Joints. This was made possible by Unity's Articulation Body API that was introduced in late 2020. 
4. This skeleton has 6 legs, for a total action space of (2 joints per leg) * (6 legs) * (3 DoF) = 36 continuous inputs. Compared to my first attempt with only two hinge joints this is a massive step up. 
5. This design was entirely procedurally generated. I wrote a quick & dirty generator for robot shapes that you can see below. Eventually I'd like to make this less procedural and more human-driven, like Spore.

`twitch: skelly-maker`

## Next Steps (pun intended)

I'm extremely pleased with the progress made so far -- if you're interested, you can check out the ML code for this on [Github](https://github.com/Steven-Ireland/ImprovementML-Brain). Here's where I'm headed next in no particular order:

### Complex Reward Functions

Currently this setup assumes an agent can calculate its own reward, which works for simple velocity and exertion rewards. Instead, I'd like to split the "reward" into two parts:
1. Environment granted, where the agent can earn "points" for completing "objectives". Velocity may be the objective for a race, but it may not be for soccer. 
2. Agent granted, with smaller signals that account for living and exertion. 

I'd also like to train the agent in one environment to simply walk to a point, and then introduce it to a more complex environment, similar to OpenAI's strategy for its soccer agents.

### User Created Skeletons

I'll need to put on my Game Designer hat for this one, but I'd like to make skeletons work more like Spore than Legos. 

### Export NN into Unity

Unity supports in-game NN inference via ONNX with its library called [Barracuda](https://github.com/Unity-Technologies/barracuda-release). Rather than using an external websocket runner it makes sense to export the model directly into the game itself.

### Action Recurrance

The agent needs to understand its previous steps in order to make wise decisions about its current behavior. It should be relatively simple (famous last words) to add in Action Recurrance via either LSTM or Stacking. 


# Thanks for reading! 