// schema for match

const matchSchema = mongoose.Schema({
    opponent: {type: String, required: true},
    wins: {type: Number, required: true},
    losses: {type: Number, required: true},
    date: {type: Date, default : () => new Date()}, 
});

const match = module.exports = mongoose.model('match', matchSchema);
