---
slug: "/post/spam-load-testing"
date: "2023-05-23"
title: "Spam: Making the Simplest Possible Load Testing Tool"
---

There are a million load testers that already exist across the internet - here are a few that I like:

`hey` - A pretty simple CLI tool for generating basic requests: https://github.com/rakyll/hey

`minigun` - Another option with better metrics publishing: https://github.com/wayfair-incubator/minigun

`vegeta` - Yet another option... (etc etc,): https://github.com/tsenart/vegeta

Conceptually, they all do the same thing: Give them a descriptor of a request that you'd like the tool
to send along with various rate options, and the tool sends that request at the given rate.

Functionally, they all do it differently: they use distinct http libraries,
have their own unique command line options, and generate their post-run reports in various formats.
If you're looking to adopt one of these tools for your team, that's a lot to learn and evaluate!

What if there was a tool that used request descriptors _that you already had_? Like with `curl`?

That's where I thought `spam` could generate some value. My team frequently needed to perform load
tests for new feature releases, and to do it, had to translate `curl` requests from their
REST Clients into the right flavor of CLI options for an off-the-shelf load test utility.

## Introducing spam!

`spam` is a tool I built that's so simple, it's almost ridiculous.
It takes in any valid command line program, and runs that command at a set rate. Here's what that
looks like to send 10 req/s to www.google.com:

```bash
spam -r 10 -- curl www.google.com
```

The cognitive overhead here is nearly zero since it uses _existing http request tooling like curl_
to handle the http request rather than baking that into `spam` itself. As a challenge, let's
look at other load test tooling and format a valid 10req/s load test in `hey`, `minigun`, or `vegeta`:

```bash
# Hey
hey -n 10 -m GET www.google.com

# Minigun
minigun -fire-target http://www.google.com -send-method GET -fire-rate 10

# Vegeta
echo "GET http://www.google.com/" | vegeta attack -rate 10
```

None of them are ridiculously complex for a simple request -- but what if we needed to send this one?
(exported in a single click from my REST client of choice, Insomnia)

```bash
curl --request POST \
--url https://www.google.com/ \
--header 'Authorization: Bearer SuperSecretToken' \
--header 'Content-Type: application/json' \
--header 'Made-Up-Header: made-up-value' \
--data '{
"hello": "world"
}'
```

Each tool has different options for HTTPS, Headers, Request Bodies, Content Types, Authorization -- it's
no longer as easy to piece it together! With `spam`, though, you can turn it into a load test the **exact
same way** as we did with the simple request above:

```bash
spam -r 10 -- curl --request POST \
--url https://www.google.com/ \
--header 'Authorization: Bearer SuperSecretToken' \
--header 'Content-Type: application/json' \
--header 'Made-Up-Header: made-up-value' \
--data '{
"hello": "world"
}'
```

It's a breath of fresh air to not worry about request complexity when scaling up the volume
on a request you've already built.

## Feature Gaps (or are they?)

Now that we've established that `spam` can do the same thing as complicated tools for simple cases,
what about the bonus features those tools provide like timeouts, load test durations, or reporting?
It turns out most of that can be done with other composed cli utilities!

### Timeouts

`curl` supports request timeouts with (`--max-time` and `--fail`), so spam does too:

```bash
# 10 req/s, timeout after 100ms
spam -r 10 -- curl --max-time 0.100 --fail www.google.com
```

The nice part about composing this utility with `curl` is that `spam` gets all of [its features](https://curl.se/docs/manpage.html) for free.
If you don't use `curl`, you can also substitute whatever http request cli that you wish.

note: `spam` doesn't currently report failure status codes, but it does track it internally. If you have ideas
for how to represent this in its output, feel free to open an issue or shoot me a message.

### Load Test Duration

`timeout` is a GNU coreutil that will end a given command after a given time, so we don't need a duration option:

```bash
timeout 10s spam -r 10 -- curl www.google.com
```

Even though it's already handled by `timeout`, I can imagine `spam` adding this feature in the future
to eliminate the dependency. In the meantime, it's excellent that a built-in feature isn't necessary.

### Reporting

`spam` outputs program execution times in milliseconds to standard out. For example:

```bash
> timeout 10s spam -- curl www.google.com
135
155
139
150
150
140
147
153
142
```

This data can be redirected to a file and imported into tools like excel / google sheets, or directly
plotted by piping it to another command line tool like `asciigraph`:

```bash
timeout 10s spam -- curl www.google.com | asciigraph -r -h 10 -w 40
```

outputs:

![image](https://github.com/Steven-Ireland/spam/assets/6981727/75737ef7-f807-4ff2-891e-e8aaba37a135)

For my use cases, I don't need my console to output request percentiles in favor of using in-app telemetry,
but since `spam` outputs the raw data, the sky's the limit for what kind of post analysis can be performed.

## Conclusion

`spam` is probably the most useful utility I've ever built, even though it's practically just a loop!
It's dead simple and can be combined with other command line tooling to achieve a wide range of outcomes
without a complex/custom API.

The utility is currently published as a Homebrew Tap if you're a mac user interested in trying it out:

```
brew tap Steven-Ireland/homebrew-tap
brew install spam
```

If you're on linux, download the latest release binary from [here](https://github.com/Steven-Ireland/spam/releases/)
and install wherever it's convenient.

If you just want to browse the code, it's available here: https://github.com/Steven-Ireland/spam

Thanks for reading, and good luck spamming your APIs!
