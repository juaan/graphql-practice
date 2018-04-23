var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');


// GraphQl schema

var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    },
    type Course {
        id: Int,
        title: String,
        author: String,
        description: String,
        topic: String,
        url: String
    }
`);

// data blay ...
var courseData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = (args) => {
    const { id } = args
    return courseData.filter(val => id === val.id)[0]
}

var getCourses = (args) => {
    if (args.topic) {
        var topic = args.topic.toLowerCase()
        return courseData.filter(val => topic === val.topic.toLowerCase())
    } else {
        return courseData
    }
}

var updateCourseTopic = ({id, topic}) => {
    courseData.map(val => {
        if (val.id == id) {
            val.topic = topic
            return val
        }
    })

    return courseData.filter( val => val.id === id)[0]
}


var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
}


var app = express()
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(4000, () => console.log('Express GraphQL Server Now'))



// Query in GraphiQL 

// get single course by id

// query getSingleCourse($courseID: Int!) {
//     course(id: $courseID) {
//         title
//         author
//         description
//         topic
//         url
//     }
// }


// Fragment Query

// query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
//     course1: course(id: $courseID1) {
//            ...courseFields
//     },
//     course2: course(id: $courseID2) {
//           ...courseFields
//     } 
// }

// fragment courseFields on Course {
// title
// author
// description
// topic
// url
// }


// mutation for update data

// mutation updateCourseTopic($id: Int!, $topic: String!) {
//     updateCourseTopic(id: $id, topic: $topic) {
//       ... courseFields
//     }
//   }
  
//   fragment courseFields on Course {
//     title
//     author
//     description
//     topic
//     url
//   }