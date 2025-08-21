package com.oracle.admin.entity;

public class Meal {
    private Integer mealId;
    private String name ;
    private String type;
    private String description;
    public String getDescription() {
        return description;
    }
    public Integer getMealId() {
        return mealId;
    }
    public String getName() {
        return name;
    }
    public String getType() {
        return type;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setMealId(Integer mealId) {
        this.mealId = mealId;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setType(String type) {
        this.type = type;
    }
}
