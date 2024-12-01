const Story = require('../model/story');


exports.getStories = async (req, res, next) => {
    try {
        const stories = await Story.find();
        if (!stories || stories.length === 0) {
            return res.status(404).json({
                header: {
                    errorCode: '404',
                    message: "No stories found"
                }
            });
        }
        return res.status(200).json({
            header: {
                errorCode: '00000',
                message: "Success"
            },
            data: stories
        });
    } catch (error) {
        console.error('Error in finding stories', error);
        next(error)
    }
}

exports.createStory = async (req, res, next) => {
    const { content, type, expirationDate } = req.body;
    const userId = req.user.id.toString();
    try {
        const story = await new Story({
            creator: userId,
            content: content,
            type: type,
            expirationDate: expirationDate,
        }).save();

        if (story) {
            return res.status(201).json({
                header: {
                    errorCode: '00000',
                    message: "Success"
                },
            });
        }
    } catch (error) {
        console.error('Error in creating story', error);
        next(error)

    }


}