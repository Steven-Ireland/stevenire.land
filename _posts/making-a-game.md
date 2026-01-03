---
slug: "/post/making-a-game"
date: "2020-09-07"
title: "Making a Deep Learning Game"
---

I recently stumbled upon an academic paper which presented a method for natural muscle-driven movement in both realistic and imaginary musculoskeletal models (credit to Thomas Geijtenbeek, Michiel van de Panne, Frank van der Stappen):

`youtube: pgaEE27nsQw`

When I saw this video, I was floored. My machine learning experience encompassed one college course that ended in classifying a few colors of flowers, not in a million years did I imagine the same principles could produce this kind of results. I wanted to recreate the paper with a game-y spin, allowing players to create fantastic creatures, teach them to walk, and competitively race them against each other.

The paper used an algorithm called `covariance matrix adaptation evolution strategy (CMA-ES)` to optimize various parameters of muscle control mechanisms such as responsiveness to feedback, as well as their locations. I briefly tried CMAES, and while it worked (pooly, likely error on my part), it required spawning a large generation of physics heavy creatures and training took hours.

A lot of my math was improvised since I don't have a great physics background, so I started wondering if deep learning could reason about the required math without me needing to! In short, I'm trying to see if a neural network could directly drive muscle activations rather than driving muscle activations off of a calculated required torque. After some research, it seemed like Deep Deterministic Policy Gradients (DDPG) would be the best choice for an agent since it could produce multiple actions in a continuous space.

## Process & Code

### Features

I basically dump all the body parts' velocities and rotation into the model as inputs, figuring this is generally what a normal brain is processing. I left out feedback force (since it's on the hard side to calculate within the game engine). Some of the values are divided significantly to bring their values closer to 1 in magnitude (I heard this was useful but I'm not 100% sure).

```python
for rigid_body in rigid_bodies:
  var rotation = rigid_body.rotation_degrees / 360
  features.append(rotation.x)
  features.append(rotation.y)
  features.append(rotation.z)
  
  var angular_velocity = rigid_body.angular_velocity / 10
  features.append(angular_velocity.x)
  features.append(angular_velocity.y)
  features.append(angular_velocity.z)
  
  var linear_velocity = rigid_body.linear_velocity / 10
  features.append(linear_velocity.x)
  features.append(linear_velocity.y)
  features.append(linear_velocity.z)
```

### Keras

My neural network uses an actor-critic setup and `keras-rl2`'s DDPGAgent. I had to write some extra code to decouple the running sequence from OpenAI Gym (as is expected), but otherwise it's just all dense layers. I'm definitely looking for suggestions on where to improve here! In some testing I found that increasing the layer sizes (64, 128, etc) seemed to lower the IQ of the actor significantly and after 30000 steps it still seemed bad; not sure if that means I need extra layers (Dropout, etc) that I'm not familiar with.

```python
# I'm basically just using a setup I found online for another problem
# I have 0 understanding of why I should shape my network this way
def _build_actor(self):
  actor = Sequential()
  actor.add(Flatten(input_shape=(1,) + self.observation_shape))
  actor.add(Dense(32))
  actor.add(Activation('sigmoid'))
  actor.add(Dense(32))
  actor.add(Activation('sigmoid'))
  actor.add(Dense(32))
  actor.add(Activation('sigmoid'))
  actor.add(Dense(self.nb_actions))
  actor.add(Activation('sigmoid'))
  return actor


def _build_critic(self, action_input, observation_input):
  flattened_observation = Flatten()(observation_input)
  x = Concatenate()([action_input, flattened_observation])
  x = Dense(32)(x)
  x = Activation('relu')(x)
  x = Dense(32)(x)
  x = Activation('relu')(x)
  x = Dense(32)(x)
  x = Activation('relu')(x)
  x = Dense(1)(x)
  x = Activation('linear')(x)
  critic = Model(inputs=[action_input, observation_input], outputs=x)
  print(critic.summary())
  return critic;
```

### Fitness

My fitness function attempted to teach the actor to maximize its head height and minimize its angular velocity:

```python
fitness = get_body().get_global_transform().origin.y * 2 - get_body().angular_velocity.length() - get_body().linear_velocity.length()
```

And here's what it looks like at first:

`twitch: standing-badly`

And later on: 

`twitch: standing-well`

or with more leg (I gave this one a lot more time, this is when I realized I'd need help):

`twitch: standing-more`

### Transferring to walking

When I attempted to transfer the same network to walking, I changed a few things. 
1. I'd start the agent off with a velocity in the target direction (to hopefully jumpstart it, spoiler alert this didn't work)
2. The fitness function now rewards velocity in the x vector
3. Each leg would start at a 15 degree angle (pointed forwards, with the hope it could learn to catch itself)

This was a huge failure.

`twitch: not-running`

## Next Steps

I'm not super sure where to go from here. Most likely I have simple options available such playing around with input features, but generally speaking I'm not super sure whether going down the path of a neural network is right or whether I should stick to the paper and try my hand at the hard maths. Let me know if you (the reader!) have any tips or suggestions towards victory here - I put this together in a week or two with no machine learning experience and was pleasantly surprised at how far I got, but I have a long way to go.

If you're interested in working on a project like this, hit me up and I'd be happy to share out the repo. 