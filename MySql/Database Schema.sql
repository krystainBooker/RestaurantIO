-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema restaurantIO
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema restaurantIO
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `restaurantIO` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `restaurantIO` ;

-- -----------------------------------------------------
-- Table `restaurantIO`.`restaurants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`restaurants` (
  `restaurantId` INT(11) NOT NULL AUTO_INCREMENT,
  `restaurantName` VARCHAR(255) NULL DEFAULT NULL,
  `restaurantDescription` VARCHAR(255) NULL DEFAULT NULL,
  `restaurantLocation` VARCHAR(255) NULL DEFAULT NULL,
  `restaurantCuisine` VARCHAR(255) NULL DEFAULT NULL,
  `restaurantRating` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`restaurantId`))
ENGINE = InnoDB
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`menufilters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`menufilters` (
  `filterId` INT(11) NOT NULL AUTO_INCREMENT,
  `filterName` VARCHAR(255) NULL DEFAULT NULL,
  `restaurantId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`filterId`),
  INDEX `restaurantId` (`restaurantId` ASC) VISIBLE,
  CONSTRAINT `menufilters_ibfk_1`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`))
ENGINE = InnoDB
AUTO_INCREMENT = 73
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`menu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`menu` (
  `itemId` INT(11) NOT NULL AUTO_INCREMENT,
  `itemName` VARCHAR(21) NULL DEFAULT NULL,
  `itemPrice` DECIMAL(15,2) NULL DEFAULT NULL,
  `itemCalories` INT(11) NULL DEFAULT NULL,
  `itemDiscount` TINYINT(4) NULL DEFAULT NULL,
  `itemDiscountPercent` INT(11) NULL DEFAULT NULL,
  `itemIsDeleted` TINYINT(4) NULL DEFAULT '0',
  `filterId` INT(11) NULL DEFAULT NULL,
  `restaurantId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`itemId`),
  INDEX `filterId` (`filterId` ASC) VISIBLE,
  INDEX `restaurantId` (`restaurantId` ASC) VISIBLE,
  CONSTRAINT `menu_ibfk_1`
    FOREIGN KEY (`filterId`)
    REFERENCES `restaurantIO`.`menufilters` (`filterId`),
  CONSTRAINT `menu_ibfk_2`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`))
ENGINE = InnoDB
AUTO_INCREMENT = 178
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`users` (
  `userId` INT(11) NOT NULL AUTO_INCREMENT,
  `userFirstName` VARCHAR(255) NULL DEFAULT NULL,
  `userLastName` VARCHAR(255) NULL DEFAULT NULL,
  `userEmail` VARCHAR(255) NULL DEFAULT NULL,
  `userPassword` VARCHAR(255) NULL DEFAULT NULL,
  `userSecretQuestion` VARCHAR(255) NULL DEFAULT NULL,
  `userSecretAnswer` VARCHAR(255) NULL DEFAULT NULL,
  `userIsAdmin` TINYINT(4) NULL DEFAULT NULL,
  `userHasSharedIncomeReport` TINYINT(4) NULL DEFAULT '0',
  `userHasSharedIncomeVDayReport` TINYINT(4) NULL DEFAULT '0',
  `RestaurantId` INT(11) NOT NULL,
  PRIMARY KEY (`userId`),
  INDEX `RestaurantId` (`RestaurantId` ASC) VISIBLE,
  CONSTRAINT `users_ibfk_1`
    FOREIGN KEY (`RestaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`))
ENGINE = InnoDB
AUTO_INCREMENT = 44
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`tablelayout`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`tablelayout` (
  `tableLayoutId` INT(11) NOT NULL AUTO_INCREMENT,
  `tablePositionX` DOUBLE NULL DEFAULT NULL,
  `tablePositionY` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY (`tableLayoutId`))
ENGINE = InnoDB
AUTO_INCREMENT = 100
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`tables`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`tables` (
  `tablesId` INT(11) NOT NULL AUTO_INCREMENT,
  `tableOccupantCount` INT(11) NULL DEFAULT '0',
  `tablesMaxCapacity` INT(11) NULL DEFAULT NULL,
  `tableState` VARCHAR(255) NULL DEFAULT NULL,
  `tableDeleted` TINYINT(4) NULL DEFAULT '0',
  `tableNumber` INT(11) NULL DEFAULT NULL,
  `restaurantId` INT(11) NULL DEFAULT NULL,
  `tableLayoutId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`tablesId`),
  INDEX `tablesFK_idx` (`restaurantId` ASC) VISIBLE,
  INDEX `tablesFK_2_idx` (`tableLayoutId` ASC) VISIBLE,
  CONSTRAINT `tablesFK_1`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`),
  CONSTRAINT `tablesFK_2`
    FOREIGN KEY (`tableLayoutId`)
    REFERENCES `restaurantIO`.`tablelayout` (`tableLayoutId`))
ENGINE = InnoDB
AUTO_INCREMENT = 95
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`bills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`bills` (
  `billId` INT(11) NOT NULL AUTO_INCREMENT,
  `billState` INT(11) NULL DEFAULT NULL,
  `billDateTime` DATETIME NULL DEFAULT NULL,
  `billCustomInstructions` VARCHAR(255) NULL DEFAULT NULL,
  `tablesId` INT(11) NULL DEFAULT NULL,
  `restaurantId` INT(11) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`billId`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  INDEX `tablesId` (`tablesId` ASC) VISIBLE,
  INDEX `restaurantId` (`restaurantId` ASC) VISIBLE,
  CONSTRAINT `bills_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `restaurantIO`.`users` (`userId`),
  CONSTRAINT `bills_ibfk_2`
    FOREIGN KEY (`tablesId`)
    REFERENCES `restaurantIO`.`tables` (`tablesId`),
  CONSTRAINT `bills_ibfk_3`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`))
ENGINE = InnoDB
AUTO_INCREMENT = 157
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`billitems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`billitems` (
  `billItemId` INT(11) NOT NULL AUTO_INCREMENT,
  `billItemPrice` DECIMAL(15,2) NULL DEFAULT '0.00',
  `billItemDiscount` TINYINT(4) NULL DEFAULT '0',
  `billItemDiscountPercent` INT(11) NULL DEFAULT '0',
  `itemId` INT(11) NOT NULL,
  `billId` INT(11) NOT NULL,
  PRIMARY KEY (`billItemId`),
  INDEX `itemId` (`itemId` ASC) VISIBLE,
  INDEX `billitems_ibfk_2_idx` (`billId` ASC) VISIBLE,
  CONSTRAINT `billitems_ibfk_1`
    FOREIGN KEY (`itemId`)
    REFERENCES `restaurantIO`.`menu` (`itemId`),
  CONSTRAINT `billitems_ibfk_2`
    FOREIGN KEY (`billId`)
    REFERENCES `restaurantIO`.`bills` (`billId`))
ENGINE = InnoDB
AUTO_INCREMENT = 393
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `restaurantIO`.`reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurantIO`.`reports` (
  `reportId` INT(11) NOT NULL AUTO_INCREMENT,
  `reportIsShare` TINYINT(4) NULL DEFAULT NULL,
  `userId` INT(11) NULL DEFAULT NULL,
  `restaurantId` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`reportId`),
  INDEX `userId` (`userId` ASC) VISIBLE,
  INDEX `restaurantId` (`restaurantId` ASC) VISIBLE,
  CONSTRAINT `reports_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `restaurantIO`.`users` (`userId`),
  CONSTRAINT `reports_ibfk_2`
    FOREIGN KEY (`restaurantId`)
    REFERENCES `restaurantIO`.`restaurants` (`restaurantId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;