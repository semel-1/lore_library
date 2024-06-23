const express = require('express');
const mongoose = require('mongoose');
const {
    User
} = require('../connection/db-config');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

let photo = null;
let message = ""

// Show profile
exports.show = async (req, res) => {
    const foundUser = req.session.user;
    if (foundUser.photo && foundUser.photo.data) {
        photo = Buffer.from(foundUser.photo.data).toString("base64");
    }
    try {
        if (!foundUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.render('profile', {
            photo,
            foundUser,
            pageName: 'profile',
            message
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Update user info
exports.updateUserInfo = [
    upload.single('photo'),
    async (req, res) => {
        try {
            const userId = req.session.user._id;

            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
            };

            if (req.body.password) {
                updateData.password = req.body.password;
            }

            if (req.file) {
                updateData.photo = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                };
                photo = Buffer.from(updateData.photo).toString("base64")
            }

            const foundUser = await User.findByIdAndUpdate(userId, updateData, {
                new: true
            });

            if (!foundUser) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Update session user
            req.session.user = foundUser;

            res.render('profile', {
                photo,
                foundUser,
                pageName: "profile",
                message: "Successfully Update the information"
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
];