# Back End Quiz

Create an express/node/mongoose/mongo server for simple restaurant review site.

## Rules

* You must complete this work on your own within the allotted time
  * Keep a good commit history to show progression of work.
* You may use normal resources that a software developer uses on the job (docs, google, your prior work)
* You may install npm packages of your choosing
* Use general best practices and common sense
  * Highly recommended to implement what is needed, no more no less
  * Blind boilerplate may not be helpful and will likely create more work
  * Focus effort on requirements
* You may ignore the presence or absence of `__v` mongoose property on 
any data format requirements (do whatever you need to with `__v` to get to passing tests)
* There are very specific testing requirements listed (after the API section)
  * You are not required to do any more than this
* You have 100 minutes to complete
* Total possible points are 70. You will be graded out of 50 points
* There is more work here than you may be able to finish in allotted time. Submit what you have. 
* Demonstrating what you know by having green tests that pass and show working code.

## Overarching requirements
* Do a fork and PR like a normal lab
* Include travis info. Having a green travis on your PR will count significantly.
* Include a `server.js` for running your server normally
* Include normal `npm`, `git`, `lint`, etc files

## API Requirements

NOTE: the JSON API requirements may not indicate the entire corresponding model

### Accepts post of a new restaurant

#### `POST` to `/restaurant` of data in following format:

```
{
    name: <required: string>,
    address: {
      street: <string>,
      city: <string>
    },
    cuisine: <required: asian|euro|northwest|comfort|other>
}
```

* `name`, `cuisine` are required
* `cuisine` should be limited to one of specified values: asian|euro|northwest|comfort|other

If any of those conditions are not met, return a 400 status code.

The JSON return response to `POST` should return the `name`, `address`, and `cuisine` fields. 
Okay to include empty `reviews` array (see below)

### Add a review to a restaurant

#### POST to `/restaurant/:id/reviews`:

```
{
    rating: <required: number 1 to 5 inclusive>,
    comments: <required: string, max length: 250 characters>,
    email: <required: email of the user making the review>
}
```

* All fields are required, otherwise return 400 error
* Reviews should be stored in same format indicated above on the restaurant document in a `reviews`
property, which is an array of reviews.
* Check that the user (represented by the `email` prop) does **NOT** already have a review for this restaurant. If they 
do, return 400 error and don't save the review.

### Retrieve list of restaurants and their reviews

#### `GET` to `/restaurants`:

```
[
    { _id: "123a...bc", name: "Bobby Burger", cuisine: "comfort" },
    { _id: "456d...ef", name: "Kung Pow!", cuisine: "asian" },
    { _id: "789g...hi", name: "Whole Foods", cuisine: "other" }
]
```

* Return exact fieldset indicated above.

#### `GET` to `/restaurants?cuisine=<name of cuisine>`:

Same as above, except only return restaurants that match that cuisine

#### `GET` to `/restaurants/:id`:

* Return the full restaurant document

## Testing

You only need to include the following e2e test scenario (note that only things marked **Test** 
need to assert correctness):

* Connect to a test database and drop database before test
* Test this workflow (structure into `describe`/`it`):
  * POST two restaurants, each of a different type of cuisine
  * **Test** that `GET` `/restaurants` returns both restaurants
  * **Test** that `GET` `/restaurants?cuisine=<one of the cuisines>` only returns one of the restaurants
  * POST three reviews from three different user emails to one of the restaurants
  * POST a fourth review from one of the same emails, **Test** that 400 returned.
  * **Test** that `GET` `/restaurants/:id` for that restaurant has the three reviews
