// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title A simple counter contract for demonstration
/// @author Simple Counter
/// @notice A basic example contract showing basic functionality
contract SimpleCounter {
    uint256 private _count;

    /// @notice Returns the current count
    /// @return The current count
    function get() external view returns (uint256) {
        return _count;
    }

    /// @notice Increments the counter by 1
    function increment() external {
        _count += 1;
    }

    /// @notice Decrements the counter by 1
    function decrement() external {
        require(_count > 0, "Counter cannot go below 0");
        _count -= 1;
    }

    /// @notice Sets the counter to a specific value
    /// @param value The value to set
    function set(uint256 value) external {
        _count = value;
    }
}
