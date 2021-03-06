var wholeObj = require("./q-deep.js");
var Q = require("q");
var assert = require("assert");

function delay(value, factor) {
    return Q.delay(100 * (factor || 1)).then(function () {
        return value;
    })
}

var spec = {
    simpleObject: {
        input: {
            a: "a",
            b: delay("b")
        },
        output: {
            a: "a",
            b: "b"
        }
    },
    nestedObject: {
        input: {
            a: "a",
            b: {c: delay("c")}
        },
        output: {
            a: "a",
            b: {c: "c"}
        }
    },
    nestedObjectPromise: {
        input: {
            a: "a",
            b: delay({c: delay("c", 2)})
        },
        output: {
            a: "a",
            b: {c: "c"}
        }
    },
    simpleArray: {
        input: ["a", delay("b")],
        output: ["a", "b"]
    },
    nestedArray: {
        input: ["a", [delay("b")]],
        output: ["a", ["b"]]
    },
    nestedArrayPromise: {
        input: ["a", delay(["b", delay("c", 2)])],
        output: ["a", ["b", "c"]]
    },
    nestedObjectInArray: {
        input: ["a", delay({
            "b": "b",
            "c": delay("c", 2)
        })],
        output: ["a", {b: "b", c: "c"}]
    },
    nestedArrayInObject: {
        input: {
            a: "a", b: delay(["b", delay("c", 2)])
        },
        output: {a: "a", b: ["b", "c"]}
    },
    number: {
        input: 2,
        output: 2
    },
    arrayWithoutPromise: {
        input: [2,3],
        output: [2,3]
    },
    promise: {
        input: delay(2),
        output: 2
    },
    promiseWithNestedStuff: {
        input: delay([
            ["a", delay({
                "b": "b",
                "c": delay("c", 2)
            })
            ], {
                a: "a", b: delay(["b", delay("c", 2)])
            }]),
        output: [
            [ "a", { b: "b", c: "c"}],
            { a: "a", b: [ "b", "c"]}
        ]
    }


};




var run = null;
Q.all(Object.keys(spec).map(function (key) {
    if (run && run !== key) {
        return;
    }
    console.log(key);
    var testSpec = spec[key];
    return wholeObj(testSpec.input).then(function (result) {
        assert.deepEqual(result, testSpec.output);
        return key + ": success";
    }).catch(function(error) {
        console.log("Error in "+key);
        console.trace(error);
        return "!!!! "+key + ": " + error;
    });
})).done(function(result) {
    console.log("Result:\n"+result.join("\n"));
});



