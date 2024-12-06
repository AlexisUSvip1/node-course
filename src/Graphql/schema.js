const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
} = require("graphql");

// Simulamos una base de datos con un arreglo en memoria
let courses = [];

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    author: { type: GraphQLString },
    category: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    course: {
      type: CourseType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return courses.find((course) => course.id === args.id);
      },
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve() {
        return courses;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCourse: {
      type: CourseType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        author: { type: GraphQLString },
        category: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newCourse = {
          id: String(courses.length + 1),
          title: args.title,
          description: args.description,
          price: args.price,
          author: args.author,
          category: args.category,
        };
        courses.push(newCourse);
        return newCourse;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
