


class Node {
    // A node holds some some data pairs
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.n_c = this.x.length;
    };

    // Gets the sum of squares by splitting at the index
    get_ss_split(ix) {
        var split_x = this.x[ix];

        // Find indices of left and right partitions
        var left_bool = this.x.map(function(x) {return x < split_x})
        var left_ix = left_bool.reduce(
            (out, bool, index) => bool? out.concat(index) : out,
            []
        )
        var right_ix = left_bool.reduce(
            (out, bool, index) => !bool? out.concat(index) : out,
            []
        )

        console.log('left_size: ' + left_ix.length)
        console.log('right_size: '+ right_ix.length)

        // Get means of left and right partitions
        var left_mean = 0;
        left_ix.forEach(ix => {left_mean += this.y[ix] / left_ix.length});

        var right_mean = 0;
        right_ix.forEach(ix => {right_mean += this.y[ix] / right_ix.length});

        // Get total sums of squared errors
        var left_sse = 0;
        left_ix.forEach(ix => {left_sse += (this.y[ix] - left_mean)**2});

        var right_sse = 0;
        left_ix.forEach(ix => {right_sse += (this.y[ix] - right_mean)**2});

        return(left_sse + right_sse)

    };

}

class RegressionTree {
    constructor(x, y, min_samples_leaf) {
        this.x = x;
        this.y = y;
        this.min_samples_leaf;
    };

    begin() {
        var top_node = new Node(this.x, this.y)

        var best_ix = 0;
        var min_sse = top_node.get_ss_split(0);

        for (var i=1; i< this.x.length; i++) {
            var sse = top_node.get_ss_split(i);
            if (sse < min_sse) {
                min_sse = sse;
                best_ix = i;
            }
            
        }
        console.log(best_ix);
    }

}


var a = jsIris.petalLength
var b = jsIris.petalWidth
var rt = new RegressionTree(a,b,3)
rt.begin()
