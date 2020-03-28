class Node {
    // A node holds some some data pairs
    constructor(x, y, min_samples_leaf) {
        // TODO order at the node level? May need to re-map
        this.x = x;
        this.y = y;
        this.n_c = this.x.length;
        this.min_samples_leaf = min_samples_leaf;
        this.traverse_ix = 0;

        var ix_sort = a =>[...a.keys()].sort((b,c)=>a[b]-a[c]);
        this.order_x = ix_sort(this.x)
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

        if ((left_ix.length < this.min_samples_leaf) || (right_ix.length < this.min_samples_leaf)) {
            return(NaN)
        }

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

        return({
            'ix': ix,
            'left_mean': left_mean,
            'right_mean': right_mean,
        });

    };
}

class RegressionTree {
    constructor(x, y, min_samples_leaf) {
        // x should be a nested array
        this.x = x;
        this.y = y;
        this.p = this.x.length;
        this.min_samples_leaf = min_samples_leaf;
    };

    get_node(p_ix) {
        var node = new Node(this.x[p_ix], this.y, this.min_samples_leaf);
        return(node);
    };

}


var x = [jsIris.petalLength, jsIris.petalWidth];
var y = jsIris.petalWidth
var rt = new RegressionTree(x,y,3)
